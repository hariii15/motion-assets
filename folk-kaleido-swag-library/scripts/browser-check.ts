import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {browser,pause} from './browser';
import {assets} from '../src/catalog/data';
import {renderSvg} from '../src/generators';
import {demoText,dirs} from './shared';
dirs();mkdirSync('exports/previews/qc',{recursive:true});const b=await browser();
try{
 await b.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
 const nav=await b.send('Page.navigate',{url:'http://127.0.0.1:8347/exports/catalog/index.html'});assert(!nav.errorText,nav.errorText);
 for(let i=0;i<100;i++){if(await b.evaluate('window.catalogReady===true'))break;await pause(100);}
 assert.equal(await b.evaluate('document.querySelectorAll("article").length'),88);
 const counts=await b.evaluate(`(()=>{const out={};for(const [key,value] of [['format','webm'],['format','lottie'],['category','kaleidoscope'],['loop','loop'],['loop','one-shot'],['beat','downbeat'],['beat','transition']]){['format','category','loop','beat'].forEach(k=>document.getElementById(k).value='');document.getElementById(key).value=value;catalogFilter();out[key+':'+value]=document.querySelectorAll('article:not([hidden])').length;}['format','category','loop','beat'].forEach(k=>document.getElementById(k).value='');catalogFilter();return out;})()`);
 assert.equal(counts['format:webm'],20);assert.equal(counts['format:lottie'],3);assert.equal(counts['category:kaleidoscope'],16);assert.equal(counts['loop:loop']+counts['loop:one-shot'],88);
 await b.evaluate(`document.querySelectorAll('img').forEach(i=>i.loading='eager');Promise.all([...document.images].map(i=>i.decode()))`);assert.equal(await b.evaluate('[...document.images].filter(i=>!i.naturalWidth).length'),0);
 const previewCount=await b.evaluate(`(()=>{let n=0;for(const card of document.querySelectorAll('article')){const s=renderLibrarySvg(card.dataset.id,{frame:21,text:'PLACEHOLDER',textTa:'TAMIL INPUT',textEn:'ENGLISH INPUT'});const host=document.createElement('div');host.innerHTML=s;if(!host.querySelector('svg')||s.includes('NaN'))throw Error(card.dataset.id);n++;}return n;})()`);assert.equal(previewCount,88);
 await b.evaluate(`document.querySelector('.play').scrollIntoView({block:'center'});document.querySelector('.play').click()`);await pause(300);const first=await b.evaluate('document.querySelector(".playing .live").innerHTML');await pause(350);const second=await b.evaluate('document.querySelector(".playing .live").innerHTML');assert.notEqual(first,second,'Live animation did not advance');
 for(const theme of ['dark','light','vermilion','moving']){await b.evaluate(`document.getElementById('theme').value='${theme}';document.getElementById('theme').dispatchEvent(new Event('change'));document.getElementById('silhouette').checked=true;document.getElementById('silhouette').dispatchEvent(new Event('change'))`);await pause(70);const shot=await b.send('Page.captureScreenshot',{format:'png'});writeFileSync('exports/previews/qc/catalog-'+theme+'.png',Buffer.from(shot.data,'base64'));}
 await b.evaluate(`document.querySelector('.playing .play')?.click()`);
 const playback:any[]=[];
 // Actual-speed browser playback, not a slowed frame-step simulation.
 for(const id of ['KaleidoscopeGallery','OpticalMotionGallery','HeroTreatmentGallery','LyricMotionGallery','SwagLayerDemo']){
 const result=await b.evaluate(`(async()=>{document.body.innerHTML='<video id="qc" muted playsinline style="width:960px;height:720px" src="../previews/${id}.mp4"></video>';const v=document.getElementById('qc');let frames=0;function tick(){frames++;if(!v.ended)v.requestVideoFrameCallback(tick)}v.requestVideoFrameCallback(tick);const start=performance.now();v.playbackRate=1;await v.play();await Promise.race([new Promise((r,j)=>{v.onended=r;v.onerror=()=>j(Error('decode'));}),new Promise((r,j)=>setTimeout(()=>j(Error('playback timeout')),20000))]);return{duration:v.duration,elapsed:(performance.now()-start)/1000,frames,width:v.videoWidth,height:v.videoHeight,rate:v.playbackRate};})()`);
 assert(result.frames>10&&result.rate===1);const duration={KaleidoscopeGallery:12.8,OpticalMotionGallery:9,HeroTreatmentGallery:6,LyricMotionGallery:6,SwagLayerDemo:4}[id]!;assert(Math.abs(result.duration-duration)<.001,'Preview duration mismatch '+id);playback.push({id,...result});
 }
 await b.send('Page.navigate',{url:'about:blank'});await pause(120);await b.send('Emulation.setDeviceMetricsOverride',{width:540,height:540,deviceScaleFactor:1,mobile:false});await b.send('Emulation.setDefaultBackgroundColorOverride',{color:{r:0,g:0,b:0,a:0}});
 await b.evaluate(`document.body.style.margin='0';document.body.innerHTML='<div id="player" style="width:540px;height:540px"></div>'`);await b.evaluate(readFileSync('node_modules/lottie-web/build/player/lottie.min.js','utf8'));
 const lottie:any[]=[];
 for(const a of assets.filter(a=>a.lottieCompatible)){
 const data=readFileSync(a.lottiePath!,'utf8');await b.evaluate(`window.anim&&anim.destroy();window.anim=lottie.loadAnimation({container:document.getElementById('player'),renderer:'svg',autoplay:false,loop:true,animationData:${data}});new Promise(r=>{if(anim.isLoaded)r();else anim.addEventListener('DOMLoaded',r)})`);
 for(const frame of [0,15,35,59]){await b.evaluate(`anim.goToAndStop(${frame},true)`);const shot=await b.send('Page.captureScreenshot',{format:'png'});const actual=await sharp(Buffer.from(shot.data,'base64')).ensureAlpha().raw().toBuffer();const expected=await sharp(Buffer.from(renderSvg(a.id,{frame}))).resize(540,540).ensureAlpha().raw().toBuffer();let error=0;for(let i=3;i<actual.length;i+=4)error+=Math.abs(actual[i]-expected[i]);error/=540*540;assert(error<1.8,`${a.id} Lottie alpha error ${error}`);lottie.push({id:a.id,frame,meanAlphaError:error});}
 }
 assert.equal(b.errors.length,0,JSON.stringify(b.errors));
 writeFileSync('exports/previews/qc/browser-report.json',JSON.stringify({result:'PASS',cards:88,livePreviewCount:previewCount,filters:counts,brokenImages:0,themes:['dark','light','vermilion','moving'],neutralOverlay:true,liveFrameAdvance:true,playback,lottie},null,2));console.log('Catalog, actual-speed playback and Lottie browser checks PASS');
}finally{b.close();}
