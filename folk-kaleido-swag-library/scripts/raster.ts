import sharp from 'sharp';
import {browser} from './browser';
let instance:Awaited<ReturnType<typeof browser>>|undefined;
let size='';
/** librsvg in the installed Sharp build omits SVG textPath. Use the existing
 * Chromium renderer for that SVG-standard feature, preserving proper shaping. */
export async function rasterSvg(svg:string,width:number,height:number):Promise<Buffer>{
 if(!svg.includes('<textPath'))return sharp(Buffer.from(svg)).resize(width,height).png().toBuffer();
 try{
 if(!instance){instance=await browser();await instance.send('Emulation.setDefaultBackgroundColorOverride',{color:{r:0,g:0,b:0,a:0}});}
 if(size!==width+'x'+height){await instance.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});size=width+'x'+height;}
 await instance.evaluate(`document.body.style.cssText='margin:0;padding:0;background:transparent;overflow:hidden';document.body.innerHTML=${JSON.stringify(svg)};document.querySelector('svg').style.cssText='display:block;width:${width}px;height:${height}px';document.fonts.ready.then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))`);
 const result=await instance.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});return Buffer.from(result.data,'base64');
 }catch(error){closeRasterizer();throw error;}
}
export function closeRasterizer(){instance?.close();instance=undefined;size='';}

process.once('exit',closeRasterizer);
