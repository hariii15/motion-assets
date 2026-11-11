import {writeFileSync,existsSync,readFileSync} from 'node:fs';
import {assets} from '../src/catalog/data';
import {renderSvg} from '../src/generators';
import {dirs,demoText} from './shared';
import {neutralHeroPath} from '../src/components/hero';
dirs();
const write=(file:string,text:string)=>{if(!existsSync(file)||readFileSync(file,'utf8')!==text)writeFileSync(file,text);};
for(const a of assets){const svg=renderSvg(a.id,{still:true,...demoText});write(a.svgPath,svg);if(a.isSourceSegment)write('assets/kaleidoscope/'+a.sourceFilename,svg);write(`assets/${a.category==='hero'?'cultural':a.category}/${a.id}.config.json`,JSON.stringify({id:a.id,generator:a.generator,sourceAsset:a.sourceAsset,segments:a.defaultSegments,seed:a.seed,animationPreset:a.animationPreset},null,2));}
write('assets/cultural/neutral-hero.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1440"><path transform="translate(540 750)" d="${neutralHeroPath}" fill="#F0D9A4"/></svg>`);
console.log('SVG masters: '+assets.length);
