import {spawnSync} from 'node:child_process';
import {writeFileSync,mkdirSync,existsSync} from 'node:fs';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {assets} from '../src/catalog/data';
import {neutralHeroPath} from '../src/components/hero';
const root='exports/previews/qc';mkdirSync(root,{recursive:true});
const selected=assets.filter(a=>a.webmPath);
const hero=Buffer.from(`<svg width="180" height="240" viewBox="0 0 1080 1440"><path transform="translate(540 750)" d="${neutralHeroPath}" fill="#171311" stroke="#F0D9A4" stroke-width="4"/></svg>`);
const palette=['#171311','#FFFFFF','#C9342F','moving','hero'];
const pageOnly=process.argv.find(a=>a.startsWith('--page='))?.slice(7);
for(let page=0;page<4;page++){if(pageOnly&&Number(pageOnly)!==page+1)continue;
 const out=root+`/encoded-alpha-plates-${page+1}.png`;if(existsSync(out)&&!pageOnly&&!process.argv.includes('--force'))continue;const tiles:sharp.OverlayOptions[]=[];
 for(const [row,a] of selected.slice(page*5,page*5+5).entries()){
 const decode=spawnSync('ffmpeg',['-v','error','-c:v','libvpx-vp9','-i',a.webmPath!,'-vf','select=eq(n\\,21),scale=180:240:force_original_aspect_ratio=decrease','-frames:v','1','-f','image2pipe','-c:v','png','pipe:1'],{maxBuffer:16*1024*1024});assert.equal(decode.status,0,decode.stderr.toString());
 const overlay=await sharp(decode.stdout).resize(180,240,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
 for(const [col,bg] of palette.entries()){
 let back:Buffer;
 if(bg==='moving'){const plate=spawnSync('ffmpeg',['-v','error','-f','lavfi','-i','testsrc2=size=180x240:rate=30:duration=2','-ss','0.7','-frames:v','1','-f','image2pipe','-c:v','png','pipe:1'],{maxBuffer:8*1024*1024});assert.equal(plate.status,0,plate.stderr.toString());back=plate.stdout;}else back=await sharp({create:{width:180,height:240,channels:4,background:bg==='hero'?'#24305E':bg}}).png().toBuffer();
 const items:sharp.OverlayOptions[]=[{input:overlay,left:0,top:0}];if(bg==='hero')items.push({input:hero,left:0,top:0});
 const label=Buffer.from(`<svg width="180" height="30"><rect width="180" height="30" fill="#F0D9A4"/><text x="90" y="12" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#171311">${a.id}</text><text x="90" y="24" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#171311">${bg}</text></svg>`);
 const tile=await sharp(back).extend({top:0,bottom:30,left:0,right:0,background:'#F0D9A4'}).composite([...items,{input:label,left:0,top:240}]).png().toBuffer();tiles.push({input:tile,left:col*180,top:row*270});
 }
 }
 await sharp({create:{width:900,height:1350,channels:4,background:'#F0D9A4'}}).composite(tiles).png().toFile(out);
}
writeFileSync(root+'/encoded-alpha-plates.json',JSON.stringify({result:'PASS',assets:selected.map(a=>a.id),frame:21,backgrounds:palette,notes:'Actual alpha-capable VP9 decode, not the SVG preview. Moving plate is a frame of generated test footage, not copyrighted video. Neutral hero is an original vector silhouette.'},null,2));
console.log('Encoded alpha contact proofs: all 20 editing exports × 5 backgrounds');
