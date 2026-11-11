import {g,rect,path,esc,repeat,circle} from '../utils/svg';
import {curve} from '../animations/easing';
import type {Context} from '../generators/types';
export function lyricBody(c:Context,kind:string):string{
 const text=c.props.text??'';if(!text&&kind!=='Tamil-English-alternator')return '';
 const safe=c.props.safeArea??92,font=c.props.fontFamily??'sans-serif',size=Math.max(20,Math.min(104,(c.w-safe*2)/Math.max(1,Array.from(text).length)*1.35));
 const t=(s=text,extra='',sz=size)=>`<text fill="${c.props.foregroundColor??c.cream}" stroke="${c.c}" stroke-width="1.1" paint-order="stroke" font-family="${esc(font)}" font-size="${sz}" font-weight="800" text-anchor="middle" dominant-baseline="middle" letter-spacing="1" ${extra}>${esc(s)}</text>`;
 const base=t(),p=c.props.still?1:c.p,id=c.prefix;
 let content='';
 switch(kind){
 case'behind-hero':content=g(t(),'translate(0 -230)')+g(t(),'translate(0 230)');break;
 case'circular':{const r=330,label=text.length<24?(text+' · ').repeat(3):text;const d=`M0 ${-r}A${r} ${r} 0 1 1 -.01 ${-r}`;content=`<defs><path id="${id}-textcircle" d="${d}"/></defs><text fill="${c.props.foregroundColor??c.cream}" stroke="${c.c}" stroke-width="1.1" paint-order="stroke" font-family="${esc(font)}" font-size="${Math.max(20,Math.min(46,size*.65))}" font-weight="700" letter-spacing="4"><textPath href="#${id}-textcircle" startOffset="0%">${esc(label)}</textPath></text>`;break;}
 case'mirror-pair':content=g(base,'translate(0 -100)')+g(base,'translate(0 100)');break;
 case'repeated-background':content=repeat(7,i=>g(t(text,'',Math.min(72,size)),`translate(${i%2?45:-45} ${(i-3)*130})`,`opacity="${i===3?1:.30}"`));break;
 case'scale-punch':content=g(base,`scale(${1+Math.max(0,c.props.beatStrength??0)*.08})`);break;
 case'slice-reveal':{const width=c.w-safe*2;content=repeat(5,i=>{const clip=id+'-line-'+i,reveal=curve('elegant-out',p*2-i*.09);return `<defs><clipPath id="${clip}">${rect(-width/2,-70+i*28,width*reveal,28.1,'white')}</clipPath></defs>`+g(base,'',`clip-path="url(#${clip})"`);});break;}
 case'beat-sequence':{const words=text.split(/\s+/);content=t(words[Math.min(words.length-1,Math.floor(p*words.length))]);break;}
 case'kaleidoscope':content=repeat(c.n,i=>g(t(text,'',Math.max(16,Math.min(32,(Math.PI*2*330/c.n*.85)/(Math.max(1,Array.from(text).length)*.62)))),`rotate(${i*360/c.n}) translate(0 -330)`));break;
 case'tunnel':content=repeat(5,i=>g(t(text,'',Math.min(80,size)),`translate(0 ${(i-2)*100}) scale(${.45+i*.13})`,`opacity="${.2+i*.15}"`));break;
 case'Tamil-English-alternator':content=t(c.frame%60<30?(c.props.textTa??''):(c.props.textEn??''));break;
 default:content=g(base,`scale(${.94+.06*curve('restrained-overshoot',p*4)})`);
 }
 const guidelines=c.props.showGuides?rect(safe-c.cx,safe-c.cy,c.w-safe*2,c.h-safe*2,'none',0,`stroke="${c.b}" stroke-dasharray="8 8"`):'';
 return g(content+guidelines,`translate(${c.cx} ${c.cy})`);
}
