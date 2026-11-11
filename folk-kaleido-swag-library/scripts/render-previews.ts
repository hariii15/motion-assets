import {existsSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {dirs} from './shared';
dirs();
for(const id of ['KaleidoscopeGallery','OpticalMotionGallery','HeroTreatmentGallery','LyricMotionGallery','SwagLayerDemo']){
 const file=`exports/previews/${id}.mp4`;if(existsSync(file))continue;
 const r=spawnSync('node_modules/.bin/remotion',['render','src/scenes/index.ts',id,file,'--scale='+(id==='SwagLayerDemo'?'1':'.5'),'--concurrency=2','--crf=18','--muted','--log=error'],{encoding:'utf8',maxBuffer:32*1024*1024,env:{...process.env,TMPDIR:process.cwd()+'/t'}});writeFileSync('.scratch/'+id+'.log',r.stdout+r.stderr);if(r.status!==0)throw Error(r.stderr+'; see .scratch/'+id+'.log');console.log('Rendered '+id);
}
