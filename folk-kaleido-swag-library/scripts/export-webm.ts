import {rasterSvg,closeRasterizer} from './raster';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdirSync,renameSync,existsSync,writeFileSync,appendFileSync} from 'node:fs';
import sharp from 'sharp';
import {assets} from '../src/catalog/data';
import {renderSvg} from '../src/generators';
import {dirs,demoText,cached,mark,sourceHash} from './shared';
dirs();mkdirSync('exports/previews/motion',{recursive:true});
const draft=process.argv.includes('--draft'),only=process.argv.find(a=>a.startsWith('--only='))?.slice(7),key=sourceHash();
for(const a of assets.filter(a=>a.webmPath&&(!only||only.split(',').includes(a.id)))){
 const file=draft?`exports/previews/motion/${a.id}.webm`:a.webmPath!,master=a.webmMasterPath!;
 if(cached(file,key)&&(draft||cached(master,key)))continue;
 const width=draft?270:a.masterWidth,height=draft?(a.editingHeight===1440?360:270):a.masterHeight;
 const options=['-c:v','libvpx-vp9','-pix_fmt','yuva420p','-b:v','0','-crf',draft?'30':'22','-deadline','realtime','-cpu-used','6','-row-mt','1','-threads','2','-auto-alt-ref','0','-lag-in-frames','0','-metadata:s:v:0','alpha_mode=1'];
 const temp=file+'.partial.webm',masterTemp=master+'.partial.webm';
 const args=['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','30','-i','pipe:0','-an'];
 if(draft)args.push(...options,temp);else args.push('-filter_complex',`[0:v]split=2[master][copy];[copy]scale=${a.editingWidth}:${a.editingHeight}:flags=lanczos[edit]`,'-map','[master]',...options,masterTemp,'-map','[edit]',...options,temp);
 const ff=spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe'],env:{...process.env,TMPDIR:process.cwd()+'/.scratch/tmp'}});let error='';ff.stderr.on('data',d=>error+=d);ff.stdin.on('error',()=>{});const done=new Promise<number|null>((r,j)=>{ff.on('error',j);ff.on('exit',r);});
 let failed=false;for(let frame=0;frame<a.durationInFrames;frame++){if(ff.exitCode!==null){failed=true;break;}const svg=renderSvg(a.id,{frame,...demoText});const png=svg.includes('<textPath')?await rasterSvg(svg,width,height):await sharp(Buffer.from(svg)).resize(width,height).png({compressionLevel:2}).toBuffer();if(!ff.stdin.write(png))await Promise.race([once(ff.stdin,'drain'),done]);}
 ff.stdin.end();const code=await done;if(code!==0||failed)throw Error(a.id+': '+error);renameSync(temp,file);mark(file,key);if(!draft){renameSync(masterTemp,master);mark(master,key);}appendFileSync('.scratch/export-log.txt',JSON.stringify({id:a.id,draft,width,height,frames:a.durationInFrames})+'\n');console.log(`${draft?'proof':'master + edit'}: ${a.id}`);
}

closeRasterizer();
