import {assets} from './data';
import {renderSvg} from '../generators';
import {neutralHeroPath} from '../components/hero';
let active:string|null=null,start=0,heroSrc:string|undefined;
const $=(id:string)=>document.getElementById(id) as HTMLInputElement;
const filters=['category','format','loop','beat'];
function filter(){let n=0;document.querySelectorAll<HTMLElement>('article').forEach(card=>{const ok=filters.every(k=>!$(k).value||(k==='format'?card.dataset.format!.split(' ').includes($(k).value):card.dataset[k]===$(k).value))&&card.dataset.id!.toLowerCase().includes($('search').value.toLowerCase());card.hidden=!ok;if(ok)n++;});$('count').textContent=`${n} / ${assets.length} forms`;}
filters.forEach(k=>$(k).addEventListener('change',filter));$('search').addEventListener('input',filter);
$('theme').addEventListener('change',()=>{document.body.dataset.theme=$('theme').value;});
$('silhouette').addEventListener('change',()=>{document.body.classList.toggle('silhouette-on',$('silhouette').checked);});
$('heroUpload').addEventListener('change',()=>{const file=$('heroUpload').files?.[0];if(!file)return;if(!['image/png','image/webp'].includes(file.type))return;heroSrc=URL.createObjectURL(file);$('heroStatus').textContent='Using your local cutout · never uploaded';});
function stop(){if(active){const card=document.getElementById('card-'+active)!;card.classList.remove('playing');card.querySelector('.live')!.innerHTML='';card.querySelector('.play')!.textContent='Animate ↗';active=null;}}
for(const b of document.querySelectorAll<HTMLButtonElement>('.play'))b.onclick=()=>{const id=b.dataset.id!;if(active===id){stop();return;}stop();active=id;start=performance.now();b.closest('article')!.classList.add('playing');b.textContent='Stop ↙';};
const visible=new Set<string>();const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting?visible.add((e.target as HTMLElement).dataset.id!):visible.delete((e.target as HTMLElement).dataset.id!)));document.querySelectorAll('article').forEach(c=>observer.observe(c));
function animate(now:number){if(active&&visible.has(active)){
 const a=assets.find(a=>a.id===active)!,elapsed=(now-start)/1000*30,frame=a.loop?elapsed%60:Math.min(59,elapsed);
 const text=$('lyricText').value,props={frame,text,textTa:$('tamilText').value,textEn:text,segments:Number($('segments').value),beatStrength:Number($('strength').value),animationPreset:$('preset').value||undefined,asset:a.category==='hero'?heroSrc:undefined,foregroundColor:document.body.dataset.theme==='light'?'#171311':undefined,instanceId:'live-'+a.id,registrationOffset:$('handmade').checked?1.5:0};
 document.getElementById('live-'+a.id)!.innerHTML=renderSvg(a.id,props);
 }requestAnimationFrame(animate);}
requestAnimationFrame(animate);
(document.getElementById('controls') as HTMLElement).querySelectorAll('input,select').forEach(el=>el.addEventListener('change',()=>{if(active)start=performance.now();}));
(window as any).catalogReady=true;(window as any).catalogFilter=filter;(window as any).renderLibrarySvg=renderSvg;
