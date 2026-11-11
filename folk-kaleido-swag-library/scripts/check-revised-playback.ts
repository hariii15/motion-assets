import {readFileSync,writeFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {browser} from './browser';
const path='exports/previews/qc/browser-report.json',previous=JSON.parse(readFileSync(path,'utf8')),checkedAt=statSync(path).mtimeMs;
for(const p of previous.playback)if(p.id!=='SwagLayerDemo')assert(statSync(`exports/previews/${p.id}.mp4`).mtimeMs<=checkedAt,'An additional preview changed and needs playback review');
const b=await browser({httpPort:8348,debugPort:9348,profile:'final-review'});
try{
 const metrics=await b.evaluate(`(async()=>{document.body.innerHTML='<video id="review" muted playsinline style="width:540px;height:720px" src="http://127.0.0.1:8348/exports/previews/SwagLayerDemo.mp4"></video>';const v=document.getElementById('review');let frames=0;function tick(){frames++;if(!v.ended)v.requestVideoFrameCallback(tick)}v.requestVideoFrameCallback(tick);v.playbackRate=1;const start=performance.now();await v.play();await Promise.race([new Promise((r,j)=>{v.onended=r;v.onerror=()=>j(Error('decode'));}),new Promise((r,j)=>setTimeout(()=>j(Error('timeout')),10000))]);return{duration:v.duration,elapsed:(performance.now()-start)/1000,frames,width:v.videoWidth,height:v.videoHeight,rate:v.playbackRate};})()`);
 assert.equal(metrics.duration,4);assert.equal(metrics.rate,1);assert(metrics.frames>50);assert.equal(metrics.width,1080);assert.equal(metrics.height,1440);
 previous.playback=previous.playback.map((p:any)=>{const hash=createHash('sha256').update(readFileSync(`exports/previews/${p.id}.mp4`)).digest('hex');return p.id==='SwagLayerDemo'?{id:p.id,...metrics,sha256:hash}:{...p,sha256:hash};});previous.latestLayerDemoReviewed=true;
 writeFileSync(path,JSON.stringify(previous,null,2));console.log('Latest four-second layer demo played at 1x; unchanged gallery evidence retained.');
}finally{b.close();}
