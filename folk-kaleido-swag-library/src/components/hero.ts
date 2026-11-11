import {g,path,rect,repeat,esc} from '../utils/svg';
import {curve} from '../animations/easing';
import type {Context,GeneratorProps} from '../generators/types';
export const neutralHeroPath='M-56 -280Q-88 -310 -72 -365Q-61 -415 0 -425Q61 -415 72 -365Q88 -310 56 -280L53 -247Q158 -218 179 -110L210 166L175 182L126 -60L112 160L145 411L67 411L15 175L-15 175L-67 411L-145 411L-112 160L-126 -60L-175 182L-210 166L-179 -110Q-158 -218 -53 -247Z';
export const neutralHero=(fill:string,stroke='none',width=0)=>path(neutralHeroPath,fill,stroke,width)+path('M-42 -238Q0 -210 42 -238M-100 120Q0 155 100 120','none',stroke,width?Math.max(1,width*.4):0);
function imageNode(c:Context,filter='',opacity=1){return c.props.asset&&!c.props.asset.endsWith('-segment')?`<image href="${esc(c.props.asset)}" x="-220" y="-450" width="440" height="900" preserveAspectRatio="xMidYMax meet" opacity="${opacity}" ${filter?`filter="url(#${filter})"`:''}/>`:neutralHero(c.props.foregroundColor??c.cream,c.c,1);}
export function heroBody(c:Context,kind:string):string{
 const id=c.prefix,asset=c.props.asset,duo=(name:string,lo:string,hi:string)=>`<filter color-interpolation-filters="sRGB" id="${id}-${name}" x="-25%" y="-20%" width="150%" height="145%"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${['R','G','B'].map((ch,i)=>{const l=parseInt(lo.slice(i*2+1,i*2+3),16)/255,h=parseInt(hi.slice(i*2+1,i*2+3),16)/255;return `<feFunc${ch} type="linear" slope="${h-l}" intercept="${l}"/>`;}).join('')}<feFuncA type="identity"/></feComponentTransfer></filter>`;
 const outline=`<filter id="${id}-outline" x="-25%" y="-20%" width="150%" height="145%"><feMorphology in="SourceAlpha" operator="dilate" radius="${c.props.strokeWidth??5}" result="d"/><feComposite in="d" in2="SourceAlpha" operator="out" result="edge"/><feFlood flood-color="${c.b}"/><feComposite in2="edge" operator="in" result="ink"/><feMerge><feMergeNode in="ink"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
 const tone=(color:string)=>`<filter id="${id}-tone-${color.slice(1)}"><feFlood flood-color="${color}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
 const zones=[...(c.props.exclusionZones??[]),...(c.props.faceSafe?[c.props.faceSafe]:[])],factor=c.h>1080?1.05:.91;
 const safeDef=zones.length?`<mask id="${id}-support-safe" maskUnits="userSpaceOnUse" x="-850" y="-850" width="1700" height="1700">${rect(-850,-850,1700,1700,'white')}${zones.map(z=>rect((z.x-c.cx)/factor,(z.y-c.cy-45)/factor,z.width/factor,z.height/factor,'black',z.kind==='face'?Math.min(z.width,z.height)/(2*factor):6)).join('')}</mask>`:'';
 const coreDef=zones.length?`<mask id="${id}-core-safe" maskUnits="userSpaceOnUse" x="-850" y="-850" width="1700" height="1700">${rect(-850,-850,1700,1700,'black')}${zones.map(z=>rect((z.x-c.cx)/factor,(z.y-c.cy-45)/factor,z.width/factor,z.height/factor,'white',z.kind==='face'?Math.min(z.width,z.height)/(2*factor):6)).join('')}</mask>`:'';
 const support=(s:string)=>zones.length?g(s,'',`mask="url(#${id}-support-safe)"`):s;
 const defs=`<defs>${safeDef}${coreDef}${duo('duo',c.c,c.a)}${outline}${[...new Set([c.a,c.b,c.c])].map(tone).join('')}</defs>`;
 const picture=(type='main',color=c.a)=>asset?imageNode(c,type==='duo'?id+'-duo':type==='outline'?id+'-outline':type==='shadow'?id+'-tone-'+color.slice(1):''):neutralHero(type==='shadow'?color:type==='duo'?c.a:c.cream,type==='outline'?c.b:c.c,type==='outline'?7:2);
 const main=picture(kind==='duotone'?'duo':kind==='outline'||kind==='freeze-impact'?'outline':'main');
 let result='';const p=c.props.still?.5:c.p,beat=c.props.beatStrength??Math.max(0,Math.sin(p*Math.PI*2));
 switch(kind){
 case'echo':{const copies=Math.min(6,c.props.copies??4),spacing=c.props.spacing??26;result=support(repeat(copies,i=>{const d=copies-i;const phase=(c.frame-d*(c.props.delayFrames??3))/Math.max(1,(c.props.durationInFrames??60)-1);return g(picture('shadow',i%2?c.a:c.b),`translate(${-d*spacing+Math.sin(phase*Math.PI*2)*9} ${d*4}) scale(${1-d*.02})`,`opacity="${.10+i*.06}"`);}))+main;break;}
 case'mirror':{const mode=c.props.symmetryMode??'left-right';result=mode==='radial'?repeat(c.props.copies??6,i=>g(picture('duo'),`rotate(${i*360/(c.props.copies??6)}) translate(0 -200) scale(.38)`)):mode==='four-way'?repeat(4,i=>g(picture('duo'),`translate(${i%2?140:-140} ${i<2?-210:210}) scale(${i%2?-.42:.42} .42)`)):g(picture('duo'),'translate(-150 0) scale(.70)')+g(picture('duo'),'translate(150 0) scale(-.70 .70)');break;}
 case'contact-sheet':{const copies=Math.max(1,Math.min(16,c.props.copies??6)),cols=Math.max(1,Math.min(4,c.props.columns??3)),rows=Math.ceil(copies/cols),sx=Math.min(c.props.spacing??250,(c.w-140)/cols),sy=Math.min((c.props.spacing??250)*1.76,(c.h-180)/rows);result=repeat(copies,i=>g(picture(i%2?'duo':'shadow',i%2?c.a:c.b),`translate(${(i%cols-(cols-1)/2)*sx} ${(Math.floor(i/cols)-(rows-1)/2)*sy}) scale(.42)`));break;}
 case'slice':{const count=Math.min(14,c.props.copies??8),vertical=c.props.symmetryMode==='left-right';result=repeat(count,i=>{const y=-450+i*900/count,x=-220+i*440/count,shift=Math.sin((c.p-i*.025)*Math.PI*2)*12*beat;const clip=id+'-slice-'+i;return `<defs><clipPath id="${clip}">${vertical?rect(x,-450,440/count+.1,900,'white'):rect(-230,y,460,900/count+.1,'white')}</clipPath></defs>`+g(g(main,vertical?`translate(0 ${shift})`:`translate(${shift} 0)`),'',`clip-path="url(#${clip})"`);});break;}
 case'colour-shadow':result=support(g(picture('shadow',c.a),`translate(${-18-beat*12} 8)`)+g(picture('shadow',c.b),`translate(${18+beat*12} 3)`))+main;break;
 case'tunnel':result=support(repeat(Math.min(8,c.props.depth??6),i=>{const s=.25+i*(.65/Math.max(1,Math.min(8,c.props.depth??6)-1));return g(picture('shadow',i%2?c.a:c.b),`scale(${s}) translate(${(5-i)*8} 0)`,`opacity="${.13+i*.09}"`);}))+g(main,'scale(.88)');break;
 case'kaleidoscope':result=support(repeat(c.n,i=>g(picture('shadow',i%2?c.a:c.b),`rotate(${i*360/c.n}) translate(0 -270) scale(.31)`)))+g(main,'scale(.55)');break;
 case'freeze-impact':result=g(main,`scale(${1+beat*.045})`);break;
 default:result=main;
 }
 if(kind==='slice'&&zones.length)result=support(result)+g(main,'',`mask="url(#${id}-core-safe)"`);
 // Safety regions restore the sharp original on slices and suppress only supporting copies elsewhere.
 return defs+g(result,`translate(${c.cx} ${c.cy+45}) scale(${c.h>1080?1.05:.91})`);
}
export type HeroTreatmentProps=GeneratorProps&{src?:string};
