import {mkdirSync,existsSync,readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const dirs=()=>{for(const x of ['exports/svg','exports/png','exports/png/1080','exports/webm','exports/webm/masters','exports/lottie','exports/previews','exports/previews/thumbs','exports/previews/proofs','exports/catalog','dist','.scratch/tmp'])mkdirSync(x,{recursive:true});};
export const demoText={text:'PLACEHOLDER',textTa:'TAMIL INPUT',textEn:'ENGLISH INPUT'};
export const run=(cmd:string,args:string[],max=32*1024*1024)=>{const r=spawnSync(cmd,args,{encoding:'utf8',maxBuffer:max,env:{...process.env,TMPDIR:process.cwd()+'/.scratch/tmp'}});if(r.status!==0)throw Error(cmd+' '+r.stderr);return r.stdout;};
export function sourceHash(){const files:string[]=[];function walk(p:string){for(const n of readdirSync(p)){const f=p+'/'+n;statSync(f).isDirectory()?walk(f):files.push(f)}}for(const p of ['src/generators','src/animations','src/utils','src/palettes'])walk(p);files.push('src/components/hero.ts','src/components/lyrics.ts');files.push('manifests/assets.json','manifests/presets.json');const h=createHash('sha256');for(const f of files.sort())h.update(f).update(readFileSync(f));return h.digest('hex');}
export const cached=(file:string,key:string)=>existsSync(file)&&existsSync(file+'.cache.json')&&JSON.parse(readFileSync(file+'.cache.json','utf8')).key===key;
export const mark=(file:string,key:string)=>writeFileSync(file+'.cache.json',JSON.stringify({key}));
