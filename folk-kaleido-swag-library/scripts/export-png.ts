import {rasterSvg,closeRasterizer} from './raster';
import sharp from 'sharp';
import {readFileSync} from 'node:fs';
import {assets} from '../src/catalog/data';
import {dirs,cached,mark,sourceHash} from './shared';
dirs();const key=sourceHash(),only=process.argv.find(a=>a.startsWith('--only='))?.slice(7);
for(const a of assets.filter(a=>!only||only.split(',').includes(a.id))){if(cached(a.pngPath,key)&&cached(a.png1080Path,key))continue;const svg=readFileSync(a.svgPath,'utf8');if(svg.includes('<textPath')){const {writeFileSync}=await import('node:fs');writeFileSync(a.pngPath,await rasterSvg(svg,a.masterWidth,a.masterHeight));writeFileSync(a.png1080Path,await rasterSvg(svg,a.editingWidth,a.editingHeight));}else{const image=sharp(Buffer.from(svg));await image.clone().resize(a.masterWidth,a.masterHeight).png().toFile(a.pngPath);await image.clone().resize(a.editingWidth,a.editingHeight).png().toFile(a.png1080Path);}mark(a.pngPath,key);mark(a.png1080Path,key);}
console.log('PNG masters + editing copies: '+assets.length+' each');

closeRasterizer();
