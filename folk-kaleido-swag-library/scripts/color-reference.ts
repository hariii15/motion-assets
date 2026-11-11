import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import type {AssetRecord} from '../src/catalog/data';
/** Compare native-resolution opaque interiors. Downsampling straight-alpha RGB
 * mixes arbitrary transparent RGB into colours and is not a valid colour test. */
export function compareOpaqueColor(file:string,sourcePng:Buffer,a:AssetRecord,master:boolean){
 const width=master?a.masterWidth:a.editingWidth,height=master?a.masterHeight:a.editingHeight;
 const actual=spawnSync('ffmpeg',['-v','error','-c:v','libvpx-vp9','-i',file,'-vf','select=eq(n\\,21)','-frames:v','1','-f','rawvideo','-pix_fmt','rgba','pipe:1'],{maxBuffer:40*1024*1024});assert.equal(actual.status,0,actual.stderr.toString());
 const args=['-v','error','-f','image2pipe','-i','pipe:0'];if(!master)args.push('-vf',`scale=${width}:${height}:flags=lanczos`);args.push('-frames:v','1','-f','rawvideo','-pix_fmt','rgba','pipe:1');
 const expected=spawnSync('ffmpeg',args,{input:sourcePng,maxBuffer:40*1024*1024});assert.equal(expected.status,0,expected.stderr.toString());assert.equal(actual.stdout.length,width*height*4);assert.equal(expected.stdout.length,width*height*4);
 let sum=0,count=0;const left=actual.stdout,right=expected.stdout;
 for(let y=5;y<height-5;y+=6)for(let x=5;x<width-5;x+=6){const k=(y*width+x)*4;if(right[k+3]<254||left[k+3]<245)continue;let flat=true;for(const [dx,dy] of [[-4,-4],[0,-4],[4,-4],[-4,0],[4,0],[-4,4],[0,4],[4,4]]){const p=((y+dy)*width+x+dx)*4;if(right[p+3]<254||[0,1,2].some(c=>Math.abs(right[p+c]-right[k+c])>1)){flat=false;break;}}if(!flat)continue;for(let c=0;c<3;c++){sum+=Math.abs(left[k+c]-right[k+c]);count++;}}
 return{meanColorError:count?sum/count:null,channelSamples:count};
}
