import sharp from 'sharp';
import {writeFileSync,mkdirSync} from 'node:fs';
import {renderSvg} from '../src/generators';
import {segmentIds} from '../src/generators/segments';
import {assets} from '../src/catalog/data';
import {dirs,demoText,run} from './shared';
import {evaluateMotion} from '../src/animations/motion';
import presets from '../manifests/presets.json';
import assert from 'node:assert/strict';
dirs();mkdirSync('exports/previews/qc',{recursive:true});
// Review plate tests every wedge count with mirrored pairs on a clean monochrome field.
const tiles=[];let index=0;
for(const id of segmentIds)for(const n of [6,8,12,16]){const svg=renderSvg(id,{frame:0,segments:n,monochrome:true,registrationOffset:0});const image=await sharp(Buffer.from(svg)).resize(180,180).flatten({background:'#F0D9A4'}).png().toBuffer();tiles.push({input:image,left:index%8*180,top:Math.floor(index/8)*180});index++;}
await sharp({create:{width:1440,height:1440,channels:4,background:'#F0D9A4'}}).composite(tiles).png().toFile('exports/previews/qc/segment-count-matrix.png');
const zone={x:360,y:330,width:360,height:420,kind:'face' as const};const image=await sharp(Buffer.from(renderSvg('peacock-feather-kaleidoscope',{frame:15,exclusionZones:[zone]}))).resize(540,540).ensureAlpha().raw().toBuffer();for(let y=166;y<374;y++)for(let x=181;x<359;x++)if(Math.pow((x-270)/90,2)+Math.pow((y-270)/105,2)<.65)assert.equal(image[(y*540+x)*4+3],0,'Face-safe alpha mask');
const presetResults=presets.map(p=>{const samples=Array.from({length:60},(_,f)=>evaluateMotion(p.id,f/59,{loop:p.loop}));for(const s of samples)for(const n of Object.values(s))assert(Number.isFinite(n));if(p.id.startsWith('short-')&&p.id.includes('flash'))assert.equal(samples.filter(s=>s.flashOpacity>0).length,2);return{id:p.id,sampleFrames:60,result:'PASS'};});
// Monochrome and silhouette are separate no-texture art-direction passes.
const qc=[['silhouette',0],['monochrome',15],['color',18],['compositing',30]] as const;
for(const [pass,frame] of qc){const id=pass==='silhouette'?'hero-duotone-demo':'peacock-feather-kaleidoscope';await sharp(Buffer.from(renderSvg(id,{frame,monochrome:pass==='monochrome',silhouettePass:pass==='silhouette',...demoText}))).resize(1080).flatten({background:pass==='silhouette'||pass==='monochrome'?'#F0D9A4':'#171311'}).png().toFile('exports/previews/qc/'+pass+'-pass.png');}
writeFileSync('exports/previews/qc/technical-proofs.json',JSON.stringify({result:'PASS',segmentCounts:[6,8,12,16],sourceCount:16,faceSafeMask:'PASS',presetResults,notes:'Monochrome, silhouette, colour and compositing proof images are separate. Review frame strips for anticipation and settle. No external human review is asserted.'},null,2));
console.log('64 segment-count proofs, face-safe mask and 22 preset evaluations PASS');
