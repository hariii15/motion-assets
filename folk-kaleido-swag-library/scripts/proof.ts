import {rasterSvg,closeRasterizer} from './raster';
import sharp from 'sharp';
import {writeFileSync,existsSync} from 'node:fs';
import {assets} from '../src/catalog/data';
import {renderSvg} from '../src/generators';
import {dirs,demoText} from './shared';
dirs();
const only=process.argv.find(a=>a.startsWith('--only='))?.slice(7);
for(const a of assets.filter(a=>!only||only.split(',').includes(a.id))){const svg=renderSvg(a.id,{still:true,...demoText});const buffer=svg.includes('<textPath')?await rasterSvg(svg,256,Math.round(256*a.masterHeight/a.masterWidth)):Buffer.from(svg);await sharp(buffer).resize(256,256,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile(a.previewPath)};
const cells=await Promise.all(assets.map(async(a,i)=>{const input=await sharp(a.previewPath).resize(150).extend({top:5,bottom:32,left:5,right:5,background:'#F0D9A4'}).composite([{input:Buffer.from(`<svg width="160" height="25"><text x="80" y="13" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#171311">${a.id}</text></svg>`),left:0,top:160}]).png().toBuffer();return{input,left:(i%8)*160,top:Math.floor(i/8)*187};}));
await sharp({create:{width:1280,height:Math.ceil(assets.length/8)*187,channels:4,background:'#F0D9A4'}}).composite(cells).png().toFile('exports/previews/contact-sheet.png');
// A small vector frame strip, sampled around anticipation, impact and settle.
const ids=['peacock-feather-kaleidoscope','checkerboard-tunnel','flower-impact-ring','hero-echo-demo','hero-slice-demo','kaleidoscope-iris'];
for(const id of ids){if(existsSync('exports/previews/proofs/'+id+'-frames.png'))continue;const frames=await Promise.all([0,3,5,15,18,24,35,59].map(async(frame,i)=>({input:await sharp(Buffer.from(renderSvg(id,{frame,...demoText}))).resize(160,210,{fit:'contain',background:'#F0D9A4'}).png().toBuffer(),left:i*160,top:0})));await sharp({create:{width:1280,height:210,channels:4,background:'#F0D9A4'}}).composite(frames).png().toFile('exports/previews/proofs/'+id+'-frames.png');}
console.log('88 contact thumbnails and six frame-stepping strips rendered');

closeRasterizer();
