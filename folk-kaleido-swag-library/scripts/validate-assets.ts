import {compareOpaqueColor} from './color-reference';
import {rasterSvg,closeRasterizer} from './raster';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {assets} from '../src/catalog/data';
import {renderSvg} from '../src/generators';
import {demoText,dirs,mark,sourceHash} from './shared';
import {segmentIds} from '../src/generators/segments';
import {neutralHeroPath} from '../src/components/hero';
dirs();
const file=(p:string)=>{assert(!p.startsWith('/')&&!p.split('/').includes('..'),'Unsupported manifest path '+p);assert(existsSync(p),'Missing '+p);assert(statSync(p).size>0,'Empty '+p);return readFileSync(p);};
const bin=(cmd:string,args:string[])=>{const r=spawnSync(cmd,args,{maxBuffer:40*1024*1024,env:{...process.env,TMPDIR:process.cwd()+'/t'}});assert.equal(r.status,0,cmd+': '+r.stderr.toString());return r.stdout;};
const report:any={result:'PASS',assets:assets.length,svg:0,pngMasters:0,pngEditingCopies:0,webmMasters:0,webmEditingCopies:0,lottie:0,sourceSegments:16,presets:22,geometrySamples:0,loopTests:0,alphaSourceComparisons:[],preservedExistingFiles:0,checks:[]};
assert.equal(assets.length,88);assert.equal(new Set(assets.map(a=>a.id)).size,88);
for(const name of readdirSync('manifests').filter(n=>n.endsWith('.json')))JSON.parse(file('manifests/'+name).toString());
const xml=bin('python',['-c',`import json,sys,xml.etree.ElementTree as E\nfrom pathlib import Path\nfor a in json.load(open('manifests/assets.json')):\n r=E.parse(a['svgPath']).getroot()\n assert r.tag=='{http://www.w3.org/2000/svg}svg'\n assert r.attrib.get('viewBox')==f"0 0 {a['masterWidth']} {a['masterHeight']}"\n ids=[e.attrib['id'] for e in r.iter() if 'id' in e.attrib]\n assert len(ids)==len(set(ids)), a['id']\n assert not any(e.tag.endswith('script') for e in r.iter())\nprint('88 SVGs parsed, viewBoxes and IDs valid')`]).toString();
function difference(a:Buffer,b:Buffer,alphaOnly=false){let error=0,count=0;for(let i=alphaOnly?3:0;i<a.length;i+=alphaOnly?4:1){error+=Math.abs(a[i]-b[i]);count++;}return error/count;}
async function validateVideo(p:string,a:typeof assets[number],master:boolean){
 file(p);const probe=JSON.parse(bin('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',p]).toString()),v=probe.streams[0];assert.equal(v.codec_name,'vp9');assert.equal(v.tags.alpha_mode??v.tags.ALPHA_MODE,'1','Missing VP9 alpha');assert.equal(v.r_frame_rate,'30/1');assert.equal(Number(v.nb_read_frames),60);assert.equal(v.width,master?a.masterWidth:a.editingWidth);assert.equal(v.height,master?a.masterHeight:a.editingHeight);assert(Math.abs(Number(probe.format.duration)-2)<.001);
 const bytes=bin('ffmpeg',['-v','error','-xerror','-c:v','libvpx-vp9','-i',p,'-vf','scale=72:96:flags=area','-f','rawvideo','-pix_fmt','rgba','pipe:1']);const size=72*96*4;assert.equal(bytes.length,size*60,'Dropped or truncated frames');let min=255,max=0;const mid=bytes.subarray(21*size,22*size);for(let i=3;i<mid.length;i+=4){min=Math.min(min,mid[i]);max=Math.max(max,mid[i]);}assert.equal(min,0,'Opaque video background');assert(max>20,'Empty alpha video');assert(!bytes.subarray(0,size).equals(bytes.subarray(21*size,22*size)),'Frozen animation '+p);
 // Compare encoded alpha with the current frame evaluator, not only container metadata.
 const sourcePng=await rasterSvg(renderSvg(a.id,{frame:21,...demoText}),a.masterWidth,a.masterHeight);
 const expectedFilter=(master?'':`scale=${a.editingWidth}:${a.editingHeight}:flags=lanczos,`)+'scale=72:96:flags=area';
 const reference=spawnSync('ffmpeg',['-v','error','-f','image2pipe','-i','pipe:0','-vf',expectedFilter,'-frames:v','1','-f','rawvideo','-pix_fmt','rgba','pipe:1'],{input:sourcePng,maxBuffer:40*1024*1024});assert.equal(reference.status,0,reference.stderr.toString());const expected=reference.stdout;
 const alphaError=difference(mid,expected,true);assert(alphaError<7.5,`Alpha/source mismatch ${p}: ${alphaError}`);const color=compareOpaqueColor(p,sourcePng,a,master);assert(color.meanColorError===null||color.meanColorError<5,`Opaque interior colour mismatch ${p}: ${color.meanColorError}`);report.alphaSourceComparisons.push({path:p,frame:21,meanAlphaError:alphaError,opaqueMeanColorError:color.meanColorError,colorChannelSamples:color.channelSamples});
 if(master)report.webmMasters++;else report.webmEditingCopies++;
}
for(const a of assets){
 assert(/^[A-Za-z0-9-]+$/.test(a.id));assert.equal(a.sourceFilename,a.id+'.svg');assert.equal(a.svgPath,`exports/svg/${a.id}.svg`);assert.equal(a.pngPath,`exports/png/${a.id}.png`);assert(a.animationPreset&&a.culturalNotes&&a.usageNotes);for(const id of a.compatibleAssets)assert(assets.some(a=>a.id===id));
 const svg=file(a.svgPath).toString();assert(!/NaN|undefined|Infinity/.test(svg),'Invalid SVG number');assert.equal(svg,renderSvg(a.id,{still:true,...demoText}),'Stale SVG '+a.id);
 for(const [p,w,h,master] of [[a.pngPath,a.masterWidth,a.masterHeight,true],[a.png1080Path,a.editingWidth,a.editingHeight,false]] as const){const meta=await sharp(file(p)).metadata();assert.equal(meta.width,w);assert.equal(meta.height,h);assert(meta.hasAlpha);const raw=await sharp(p).resize(128,128,{fit:'fill'}).ensureAlpha().raw().toBuffer();let opaque=0,clear=0;for(let i=3;i<raw.length;i+=4){if(raw[i]>0)opaque++;if(raw[i]===0)clear++;}assert(opaque>3&&clear>128,'Empty or flattened PNG '+p);assert.equal(raw[3],0,'Opaque corner');const reference=await sharp(await rasterSvg(svg,w,h)).ensureAlpha().raw().toBuffer();const sourcePixels=await sharp(reference,{raw:{width:w,height:h,channels:4}}).resize(128,128,{fit:'fill'}).ensureAlpha().raw().toBuffer();assert(difference(raw,sourcePixels)<.15,'Stale PNG pixels '+p);master?report.pngMasters++:report.pngEditingCopies++;}
 const first=await sharp(await rasterSvg(renderSvg(a.id,{frame:0,...demoText}),160,160)).ensureAlpha().raw().toBuffer();let changed=false;
 for(const frame of [7,15,23,39,59]){
 const source=renderSvg(a.id,{frame,...demoText});const current=await sharp(await rasterSvg(source,160,160)).ensureAlpha().raw().toBuffer();if(difference(first,current)>.015)changed=true;
 // Remove only the safety and reveal mattes when looking for accidental overflow.
 const expanded=source.replace(`viewBox="0 0 ${a.masterWidth} ${a.masterHeight}"`,`viewBox="-200 -200 ${a.masterWidth+400} ${a.masterHeight+400}"`).replace(/mask="url\(#[A-Za-z0-9_-]+-safe\)"/g,'').replace(/clip-path="url\(#[A-Za-z0-9_-]+-reveal\)"/g,'');
 const {data,info}=await sharp(await rasterSvg(expanded,280,Math.round(280*a.masterHeight/a.masterWidth))).ensureAlpha().raw().toBuffer({resolveWithObject:true});const x0=200/(a.masterWidth+400)*info.width,x1=(a.masterWidth+200)/(a.masterWidth+400)*info.width,y0=200/(a.masterHeight+400)*info.height,y1=(a.masterHeight+200)/(a.masterHeight+400)*info.height;let spill=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if((x<x0-1||x>x1+1||y<y0-1||y>y1+1)&&data[(y*info.width+x)*4+3]>12)spill++;assert.equal(spill,0,`Clipping ${a.id} frame ${frame}`);report.geometrySamples++;
 }
 assert(changed,'No meaningful motion '+a.id);
 if(a.loop){const last=await sharp(await rasterSvg(renderSvg(a.id,{frame:59,...demoText}),160,160)).ensureAlpha().raw().toBuffer();assert(difference(first,last)<.15,'Loop seam '+a.id);report.loopTests++;}
 file(a.previewPath);report.svg++;
 if(a.webmPath){await validateVideo(a.webmPath,a,false);await validateVideo(a.webmMasterPath!,a,true);}
 if(a.lottiePath){const j=JSON.parse(file(a.lottiePath).toString());assert(a.lottieCompatible&&j.layers.length&&j.fr===30&&j.op===60);report.lottie++;}
}
// Rotational symmetry is tested at the two-sector period for paired mirrored wedges.
for(const id of segmentIds)for(const segments of [6,8,12,16]){const base=await sharp(Buffer.from(renderSvg(id,{frame:0,segments}))).resize(270).ensureAlpha().raw().toBuffer();const rotated=await sharp(Buffer.from(renderSvg(id,{frame:0,segments,rotation:720/segments}))).resize(270).ensureAlpha().raw().toBuffer();assert(difference(base,rotated,true)<1.5,`Radial seam / symmetry ${id} / ${segments}`);}
// Real user-cutout path exercises alpha-preserving raster filters without using a photograph.
const testSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="900" viewBox="-220 -450 440 900"><path d="${neutralHeroPath}" fill="#807464"/></svg>`,rgba=await sharp(Buffer.from(testSvg)).png().toBuffer(),uri='data:image/png;base64,'+rgba.toString('base64');
for(const id of ['hero-duotone-demo','hero-outline-demo','hero-echo-demo','hero-slice-demo']){const raw=await sharp(Buffer.from(renderSvg(id,{frame:25,asset:uri,faceSafe:{x:420,y:300,width:240,height:260,kind:'face'}}))).resize(270).ensureAlpha().raw().toBuffer();assert(raw.some((n,i)=>i%4===3&&n===255),'Raster hero lost opacity');}
const monoXml=spawnSync('python',['-c',`import sys,xml.etree.ElementTree as E
r=E.fromstring(sys.stdin.read())
ids=[e.attrib['id'] for e in r.iter() if 'id' in e.attrib]
assert len(ids)==len(set(ids))`],{input:renderSvg('hero-outline-demo',{frame:21,monochrome:true}),encoding:'utf8'});assert.equal(monoXml.status,0,monoXml.stderr);
const html=file('exports/catalog/index.html').toString();file('exports/catalog/catalog.js');for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const p=resolve('exports/catalog',match[1]);assert(p.startsWith(process.cwd()+'/'),'Catalog path escaped');assert(existsSync(p),'Broken catalog link '+match[1]);}
for(const [id,count,w,h] of [['KaleidoscopeGallery',384,960,540],['OpticalMotionGallery',270,960,540],['HeroTreatmentGallery',180,960,540],['LyricMotionGallery',180,960,540],['SwagLayerDemo',120,1080,1440]] as const){const p=`exports/previews/${id}.mp4`;file(p);const j=JSON.parse(bin('ffprobe',['-v','error','-count_frames','-show_streams','-of','json',p]).toString());const v=j.streams.find((s:any)=>s.codec_type==='video');assert.equal(Number(v.nb_read_frames),count);assert.equal(v.width,w);assert.equal(v.height,h);assert(Math.abs(Number(v.duration)-count/30)<.001,'Preview duration mismatch '+id);assert.equal(j.streams.length,1,'Unexpected silent-audio padding track '+id);bin('ffmpeg',['-v','error','-xerror','-i',p,'-f','null','-']);}
const plates=JSON.parse(file('exports/previews/qc/encoded-alpha-plates.json').toString());assert.equal(plates.assets.length,20);assert.equal(plates.backgrounds.length,5);const browser=JSON.parse(file('exports/previews/qc/browser-report.json').toString());assert.equal(browser.result,'PASS');assert.equal(browser.playback.length,5);assert.equal(browser.lottie.length,12);const technical=JSON.parse(file('exports/previews/qc/technical-proofs.json').toString());assert.equal(technical.presetResults.length,22);
const baseline=JSON.parse(file('manifests/preservation-baseline.json').toString());report.preservationScope=existsSync(resolve('..','south-indian-folk-motion-library'))?'original repository checkout':'not applicable: standalone extracted package';for(const [p,hash] of Object.entries(report.preservationScope==='original repository checkout'?baseline:{})){const actual=resolve('..',p as string);assert(existsSync(actual),'Existing file removed '+p);assert.equal(createHash('sha256').update(readFileSync(actual)).digest('hex'),hash,'Existing file modified '+p);report.preservedExistingFiles++;}
assert.equal(report.svg,88);assert.equal(report.pngMasters,88);assert.equal(report.webmMasters,20);assert.equal(report.webmEditingCopies,20);assert.equal(report.lottie,3);
report.checks=['strict XML and JSON','unique IDs and consistent manifest paths','2160px SVG and alpha PNG masters','1080px convenience copies','unmasked geometry overflow: 440 frame samples','64 paired-wedge symmetry comparisons','loop seam comparisons','raster cutout filters and face-safe controls','40 VP9 files decoded including alpha','encoded alpha compared with current SVG evaluator','all local catalog links and 88 previews','five compositions decoded and played at 1x in Chromium','12 Lottie frame comparisons against SVG','existing library hashes unchanged'];
writeFileSync('exports/previews/validation-report.json',JSON.stringify(report,null,2));
// Promote caches only after outputs have been checked against the current evaluator.
const key=sourceHash();for(const a of assets){mark(a.pngPath,key);mark(a.png1080Path,key);if(a.webmPath){mark(a.webmPath,key);mark(a.webmMasterPath!,key);}}
console.log(JSON.stringify({result:report.result,svg:report.svg,pngMasters:report.pngMasters,pngEditingCopies:report.pngEditingCopies,webmMasters:report.webmMasters,webmEditingCopies:report.webmEditingCopies,lottie:report.lottie,preservedExistingFiles:report.preservedExistingFiles},null,2));

closeRasterizer();
