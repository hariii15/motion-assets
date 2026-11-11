import {spawnSync} from 'node:child_process';
import {renameSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const run=(args:string[])=>{const r=spawnSync('ffmpeg',args,{encoding:'utf8',maxBuffer:8*1024*1024});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
mkdirSync('.scratch',{recursive:true});const report:any[]=[];
for(const [id,frames] of [['KaleidoscopeGallery',384],['OpticalMotionGallery',270],['HeroTreatmentGallery',180],['LyricMotionGallery',180],['SwagLayerDemo',120]] as const){
 const file=`exports/previews/${id}.mp4`,tmp=`.scratch/${id}-video-only.mp4`;
 const hash=run(['-v','error','-i',file,'-map','0:v:0','-c:v','copy','-f','hash','-hash','sha256','pipe:1']);
 run(['-v','error','-y','-i',file,'-map','0:v:0','-an','-c:v','copy','-movflags','+faststart',tmp]);
 assert.equal(run(['-v','error','-i',tmp,'-map','0:v:0','-c:v','copy','-f','hash','-hash','sha256','pipe:1']),hash,'Video essence changed');renameSync(tmp,file);
 const probe=spawnSync('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file],{encoding:'utf8'});assert.equal(probe.status,0);const j=JSON.parse(probe.stdout);assert.equal(j.streams.length,1);assert.equal(Number(j.streams[0].nb_read_frames),frames);assert(Math.abs(Number(j.format.duration)-frames/30)<.001);
 report.push({id,frames,duration:frames/30,videoEssenceUnchanged:true,encodedVideoSha256:hash.split('=')[1],audioTracks:0});
}
writeFileSync('exports/previews/qc/exact-duration-report.json',JSON.stringify({result:'PASS',method:'Lossless video-only remux; unchanged encoded-video hashes verified.',previews:report},null,2));console.log('All five previews have exact video durations and unchanged picture streams.');
