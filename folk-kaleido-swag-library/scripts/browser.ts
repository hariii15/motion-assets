import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve,extname} from 'node:path';
export const pause=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export async function browser(options:{httpPort?:number;debugPort?:number;profile?:string}={}){
 const httpPort=options.httpPort??8347,debugPort=options.debugPort??9347,profile=options.profile??'browser';
 const root=process.cwd();mkdirSync('t/'+profile,{recursive:true});
 const server=createServer((req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent((req.url??'/').split('?')[0]));if(!p.startsWith(root+'/')){res.writeHead(403).end();return;}const data=readFileSync(p),mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.json':'application/json'};res.setHeader('Content-Type',mime[extname(p)]??'application/octet-stream');if(req.headers.range){const match=/bytes=(\d+)-(\d*)/.exec(req.headers.range)!;const start=Number(match[1]),end=match[2]?Number(match[2]):data.length-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});res.end(data.subarray(start,end+1));}else res.end(data);}catch{res.writeHead(404).end();}});
 await new Promise<void>(r=>server.listen(httpPort,'127.0.0.1',r));
 const child=spawn(process.env.CHROMIUM_PATH??'/usr/bin/chromium',['--headless','--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required','--remote-debugging-port='+debugPort,'--user-data-dir='+root+'/t/'+profile,'about:blank'],{stdio:'ignore',env:{...process.env,TMPDIR:root+'/t'}});
 let pages:any[]=[];for(let i=0;i<80;i++){try{pages=await(await fetch('http://127.0.0.1:'+debugPort+'/json')).json();if(pages.length)break;}catch{}await pause(150);}
 if(!pages.length){child.kill();server.close();throw Error('Browser startup failed');}
 const ws=new WebSocket(pages[0].webSocketDebuggerUrl);await new Promise<void>(r=>ws.addEventListener('open',()=>r(),{once:true}));let next=0;const pending=new Map<number,{r:(v:any)=>void;j:(e:any)=>void}>();const errors:string[]=[];
 ws.addEventListener('message',e=>{const d=JSON.parse(String(e.data));if(d.id){const p=pending.get(d.id);if(p){pending.delete(d.id);d.error?p.j(d.error):p.r(d.result);}}else if(d.method==='Runtime.exceptionThrown')errors.push(JSON.stringify(d.params.exceptionDetails));});
 const send=(method:string,params:any={})=>new Promise<any>((r,j)=>{const id=++next;pending.set(id,{r,j});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async(expression:string)=>{const out=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(out.exceptionDetails)throw Error(JSON.stringify(out.exceptionDetails));return out.result?.value;};
 await send('Runtime.enable');
 return {send,evaluate,errors,close:()=>{ws.close();child.kill('SIGTERM');server.close();}};
}
