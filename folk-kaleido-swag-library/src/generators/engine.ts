import {getAsset} from '../catalog/data';
import {segment,segmentIds} from './segments';
import {seeded,clamp} from '../utils/random';
import {path,circle,rect,g,repeat,TAU,fmt,esc} from '../utils/svg';
import {evaluateMotion} from '../animations/motion';
import {curve} from '../animations/easing';
import {heroBody} from '../components/hero';
import {lyricBody} from '../components/lyrics';
import type {Context,GeneratorProps} from './types';
export type {GeneratorProps,ExclusionZone} from './types';
export const circleRadii=[160,275,390];
export function circleBody(c:Context){return circleRadii.map((r,i)=>circle(c.cx,c.cy,r,'none',[c.a,c.b,c.cream][i],i===1?13:7)).join('');}
const normalSegment=(c:Context)=>c.props.sourceSvg??segment(c.props.asset&&segmentIds.includes(c.props.asset)?c.props.asset:getAsset(c.id).sourceAsset,c.a,c.b,c.c,c.stroke);
function kaleido(c:Context):string{
 const n=c.n,r=c.props.outerRadius??440,inner=c.props.innerRadius??120,angle=Math.PI/n,prefix=c.prefix;
 const sector=`M0 0L${fmt(Math.sin(-angle)*600)} ${fmt(-Math.cos(angle)*600)}A600 600 0 0 1 ${fmt(Math.sin(angle)*600)} ${fmt(-Math.cos(angle)*600)}Z`;
 const source=normalSegment(c),mirror=c.props.mirror??true;
 const shells=repeat(n,i=>{const a=(i%2&&c.props.alternateColors?.length)?c.props.alternateColors[i%c.props.alternateColors.length]:c.a;const piece=a===c.a?source:(c.props.sourceSvg??segment(getAsset(c.id).sourceAsset,a,c.b,c.c,c.stroke));return g(g(piece,`scale(${mirror&&i%2?-1:1} 1)`),`rotate(${fmt(i*360/n)})`,`clip-path="url(#${prefix}-sector)"`);});
 const registration=c.props.registrationOffset??0;
 const ink=registration?g(shells,`translate(${registration} ${registration*.6})`,`opacity=".16"`):'';
 return `<defs><clipPath id="${prefix}-sector">${path(sector,'white')}</clipPath><mask id="${prefix}-hole">${rect(-600,-600,1200,1200,'white')}${circle(0,0,Math.max(0,inner-16),'black')}</mask></defs>`+g(g(ink+shells,'',`mask="url(#${prefix}-hole)"`),`translate(${c.cx} ${c.cy}) scale(${r/455})`)+circle(c.cx,c.cy,r+7,'none',c.b,2)+circle(c.cx,c.cy,Math.max(8,inner-20),'none',c.b,2);
}
function radial(c:Context,source:string,radius=300,count=c.n,scale=.55,rotation=0):string{
 return g(repeat(count,i=>g(segment(source,i%2?c.a:c.b,c.cream,c.c,c.stroke),`rotate(${fmt(i*360/count+rotation)}) translate(0 ${-radius+300*scale}) scale(${scale})`)),`translate(${c.cx} ${c.cy})`);
}
function kolam(c:Context):string{
 const v=c.props.variant??c.id;
 if(v.includes('infinity'))return g(repeat(6,i=>g(path('M-380 0C-380 -260 -80 -270 0 0C80 270 380 260 380 0C380 -260 80 -270 0 0C-80 270 -380 260 -380 0','none',i%2?c.a:c.b,5),`rotate(${i*15}) scale(${1-i*.12})`)),`translate(${c.cx} ${c.cy})`);
 return radial(c,'kolam-wedge-01',360,16,.75)+radial(c,'kolam-wedge-02',210,12,.39,15)+circle(c.cx,c.cy,110,'none',c.cream,3);
}
function optical(c:Context):string{
 const v=c.props.variant??c.id,phase=c.props.still?0:c.p,cycle=(1-Math.cos(phase*TAU))/2,depth=Math.max(3,Math.min(9,c.props.depth??6));
 if(v.includes('pulse-target'))return circleBody(c);
 if(v.includes('checkerboard'))return g(repeat(depth,j=>{const s=.27+j*.105+cycle*.025,extent=440*s;return g(repeat(28,i=>{const side=Math.floor(i/7),index=i%7,x=-440+index*880/7;const fill=(i+j)%3===0?c.c:(i+j)%2?c.a:c.cream;return g(rect(x,-440,880/7+.1,36,fill),`rotate(${side*90})`);}),`rotate(${j%2?0:3}) scale(${s})`)+circle(0,0,extent*.98,'none',c.b,1);}),`translate(${c.cx} ${c.cy})`);
 if(v.includes('diamond-grid'))return g(repeat(9,y=>repeat(9,x=>{const px=(x-4)*91,py=(y-4)*91,d=Math.hypot(px,py);if(d<130||d>435)return '';return g(path('M0 -34L34 0L0 34L-34 0Z',(x+y)%2?c.a:c.b,c.c,3)+circle(0,0,6,c.cream),`translate(${px} ${py}) rotate(${cycle*9})`);})),`translate(${c.cx} ${c.cy})`);
 if(v.includes('dot-field'))return g(repeat(15,row=>repeat(15,col=>{const x=(col-7)*54,y=(row-7)*54,d=Math.hypot(x,y);if(d<120||d>435)return '';return circle(x+Math.sin(y/110+phase*TAU)*9,y+Math.cos(x/150+phase*TAU)*8,3+(row+col)%5,(row+col)%3?c.a:c.cream);})),`translate(${c.cx} ${c.cy})`);
 if(v.includes('Tamil'))return radial(c,'Tamil-letter-segment',330,c.props.segments??16,.69)+circle(c.cx,c.cy,420,'none',c.b,3)+circle(c.cx,c.cy,230,'none',c.cream,2);
 if(v.includes('wheel-portal'))return circle(c.cx,c.cy,430,'none',c.a,17)+circle(c.cx,c.cy,403,'none',c.cream,3)+radial(c,'temple-car-wheel-segment',310,16,.75,cycle*3)+radial(c,'textile-diamond-segment',370,16,.28)+circle(c.cx,c.cy,160,'none',c.b,15)+circle(c.cx,c.cy,130,'none',c.a,6);
 if(v.includes('infinity'))return kolam(c);
 if(v.includes('textile'))return radial(c,'textile-diamond-segment',340,c.props.segments??16,.78)+radial(c,'textile-diamond-segment',220,c.props.segments?Math.max(4,Math.round(c.props.segments*.75)):12,.47,15)+circle(c.cx,c.cy,428,'none',c.cream,3);
 if(v.includes('mirrored-peacock'))return radial(c,'peacock-feather-segment',330,12,.79)+circle(c.cx,c.cy,135,'none',c.b,5);
 if(v.includes('kolam-rings'))return kolam(c);
 const source=v.includes('lotus')?'lotus-petal-segment':v.includes('arches')?'temple-arch-segment':v.includes('garland')?'jasmine-chain-segment':v.includes('vortex')?'textile-diamond-segment':'flower-chain-segment';
 return repeat(depth,j=>{const t=j/(depth-1),radius=145+t*255,scale=.20+t*.48,rotation=j*(c.props.twist??9)+cycle*(j%2?2:-2);return radial(c,source,radius,v.includes('lotus')?12:16,scale,rotation);})+circle(c.cx,c.cy,105,'none',c.cream,3);
}
function impact(c:Context):string{
 const v=c.props.variant??c.id;if(v.includes('print-stamp-circle')||v.includes('drum-pulse'))return circleBody(c);
 const r=seeded(c.seed),p=c.props.still?.6:curve('elegant-out',c.p),radius=280+p*85;
 if(v.includes('cloud')||v.includes('powder'))return g(repeat(v.includes('powder')?100:28,i=>{const t=r()*TAU,rr=120+r()*270,s=v.includes('powder')?1+r()*6:9+r()*27;return circle(Math.cos(t)*rr,Math.sin(t)*rr,s,i%3===0?c.cream:i%2?c.a:c.b,'none',0,`opacity="${.35+r()*.6}"`);}),`translate(${c.cx} ${c.cy})`);
 if(v.includes('speed-lines'))return g(repeat(32,i=>g(path(`M0 -${230+r()*100}L0 -${400+r()*25}`,'none',i%3?c.a:c.cream,i%2?2:6),`rotate(${i*11.25})`)),`translate(${c.cx} ${c.cy})`);
 if(v.includes('vermilion'))return g(path('M-330 -140Q-210 -370 30 -350Q260 -325 340 -110Q380 120 200 280Q-35 400 -290 200Q-390 30 -330 -140Z',c.a,c.cream,5)+repeat(15,i=>circle((r()-.5)*580,(r()-.5)*580,1+r()*3,c.c)),`translate(${c.cx} ${c.cy})`);
 const source=v.includes('peacock')?'peacock-feather-segment':v.includes('Tamil')?'Tamil-letter-segment':v.includes('leaf')?'banana-leaf-segment':v.includes('arrow')?'painted-arrow-segment':v.includes('kolam')?'kolam-wedge-02':v.includes('brush')?'mural-brush-segment':v.includes('petal')?'lotus-petal-segment':v.includes('star')?'textile-diamond-segment':'flower-chain-segment';
 return radial(c,source,radius,c.props.copies??c.n,v.includes('shatter')?.48:.65)+circle(c.cx,c.cy,135+p*30,'none',c.b,3)+repeat(12,i=>{const angle=i*TAU/12;return circle(c.cx+Math.cos(angle)*435,c.cy+Math.sin(angle)*435,3,c.cream);});
}
function transition(c:Context):string{
 const v=c.props.variant??c.id,p=c.props.still?.5:curve('elegant-out',c.p),count=c.n;
 if(v.includes('hero-silhouette'))return heroBody({...c,props:{...c.props,asset:undefined,foregroundColor:c.a}},'duotone');
 if(v.includes('colour-stamp')||v.includes('block-print'))return g(impact({...c,props:{...c.props,variant:'vermilion-stamp-impact'}}),`translate(${c.cx} ${c.cy}) scale(${.50+p*.5}) translate(${-c.cx} ${-c.cy})`);
 if(v.includes('wedge')||v.includes('shutter')||v.includes('iris')){
 const outer=435,inner=v.includes('shutter')?135*(1-p):75+p*180;
 const pieces=repeat(count,i=>{const start=-Math.PI/2-Math.PI/count,end=-Math.PI/2+Math.PI/count,portion=(v.includes('wedge')?.12+p*.85:1)* (end-start),e=start+portion;const x=(r:number,t:number)=>fmt(Math.cos(t)*r),y=(r:number,t:number)=>fmt(Math.sin(t)*r);const d=`M${x(outer,start)} ${y(outer,start)}A${outer} ${outer} 0 0 1 ${x(outer,e)} ${y(outer,e)}L${x(inner,e)} ${y(inner,e)}A${inner} ${inner} 0 0 0 ${x(inner,start)} ${y(inner,start)}Z`;return g(path(d,i%2?c.a:c.b,c.c,1),`rotate(${i*360/count})`);});
 const source=v.includes('lotus')?'lotus-petal-segment':v.includes('peacock')?'peacock-feather-segment':'textile-diamond-segment';return g(pieces,`translate(${c.cx} ${c.cy})`)+radial(c,source,320,count,.55);
 }
 if(v.includes('chain-sweep'))return g(radial(c,'flower-chain-segment',330,16,.7),`translate(${(p-.5)*100} 0)`);
 const source=v.includes('Tamil')?'Tamil-letter-segment':v.includes('arch')?'temple-arch-segment':v.includes('wheel')?'temple-car-wheel-segment':v.includes('textile')?'textile-diamond-segment':v.includes('flower')?'flower-chain-segment':'kolam-wedge-01';
 return repeat(5,i=>radial(c,source,145+i*65,12,.23+i*.095,i*11+p*4));
}
function texture(c:Context):string{
 const r=seeded(c.seed),v=c.props.variant??c.id;
 if(v.includes('registration'))return repeat(8,y=>repeat(8,x=>g(path('M0 -28L28 0L0 28L-28 0Z','none',c.a,2)+g(path('M0 -28L28 0L0 28L-28 0Z','none',c.b,1),'translate(2 1)'),`translate(${150+x*110} ${c.h/2-385+y*110})`)));
 return repeat(v.includes('fibre')?240:540,i=>{const x=85+r()*(c.w-170),y=85+r()*(c.h-170),s=.45+r()*1.2;return v.includes('fibre')?path(`M${x} ${y}q${r()*8} -3 ${4+r()*11} ${r()*4}`,'none',i%2?c.cream:c.a,.6,`opacity="${.05+r()*.12}"`):circle(x,y,s,i%3?c.cream:(c.props.still?c.c:c.a),'none',0,`opacity="${.08+r()*.15}"`);});
}
export const bodies={KaleidoscopeGenerator:kaleido,RadialPatternGenerator:(c:Context)=>radial(c,c.props.asset??'textile-diamond-segment'),OpticalTunnelGenerator:optical,HeroEchoGenerator:(c:Context)=>heroBody(c,'echo'),HeroSymmetryGenerator:(c:Context)=>heroBody(c,'mirror'),KolamGenerator:kolam,TamilLetterRingGenerator:(c:Context)=>radial(c,'Tamil-letter-segment',330,c.props.segments??16,.7),FolkPatternGenerator:(c:Context)=>radial(c,'textile-diamond-segment',330,16,.7),ImpactBurstGenerator:impact,TransitionMaskGenerator:transition,LyricPatternGenerator:(c:Context)=>lyricBody(c,'stamp'),ScreenPrintTextureGenerator:texture};
export type GeneratorName=keyof typeof bodies;
export function renderBody(id:string,props:GeneratorProps={}){
 const a=getAsset(id),duration=props.durationInFrames??a.durationInFrames,fps=props.fps??a.fps,loop=props.loop??a.loop,frame=props.frame??0;
 const p=props.progress??(loop?((frame%Math.max(1,duration))+duration)%duration/(duration-1):clamp(frame/(duration-1)));
 const pose=evaluateMotion(props.animationPreset??a.animationPreset,p,{loop,intensity:props.intensity,beatStrength:props.beatStrength,still:props.still,durationInFrames:duration});
 const pal=a.palette,swap=pose.paletteIndex%3;const monochrome=props.monochrome||props.silhouettePass;
 const c:Context={id,p:pose.phase,frame,w:1080,h:a.editingHeight,cx:540,cy:a.editingHeight/2,a:monochrome?'#171311':props.primaryColor??pal[swap],b:monochrome?'#F0D9A4':props.secondaryColor??pal[(swap+1)%3],c:monochrome?'#171311':props.accentColor??pal[2],cream:monochrome?'#F0D9A4':pal[3],n:Math.max(4,Math.min(24,Math.round(props.segments??a.defaultSegments))),seed:props.seed??a.seed,power:props.intensity??.65,stroke:props.strokeWidth??3,prefix:(props.instanceId??id).replace(/[^A-Za-z0-9_-]/g,''),loop,props};
 let markup='';const v=props.variant??id;
 if(a.isSourceSegment&&props.still)markup=g(segment(v,c.a,c.b,c.c,c.stroke),`translate(540 1020) scale(2.1)`);
 else if(a.category==='hero'){const kind=v.replace(/^hero-/,'').replace(/-demo$/,'');markup=heroBody(c,kind);}
 else if(a.category==='typography'){const map:Record<string,string>={'lyric-circular-demo':'circular','lyric-kaleidoscope-demo':'kaleidoscope','Tamil-English-alternator-demo':'Tamil-English-alternator'};markup=lyricBody(c,map[v]??v.replace(/^lyric-/,'').replace(/-demo$/,''));}
 else if(a.category==='impact')markup=impact(c);
 else if(a.category==='transitions')markup=transition(c);
 else if(a.category==='textures')markup=texture(c);
 else if(a.isSourceSegment||id.endsWith('kaleidoscope')){const source=a.isSourceSegment?id:a.sourceAsset;markup=kaleido({...c,props:{...props,asset:props.asset??source}});}
 else if(id==='Tamil-letter-ring')markup=bodies.TamilLetterRingGenerator(c);
 else markup=optical(c);
 const registration=props.registrationOffset??0;
 if(registration&&!a.isSourceSegment&&a.category!=='hero'&&a.category!=='typography')markup=g(markup.replace(/<defs>[\s\S]*?<\/defs>/g,''),`translate(${registration} ${registration*.5})`,`opacity=".16"`)+markup;
 const rot=(props.rotation??0)+pose.rotation*(props.direction??1)+(props.rotationSpeed??0)*p*(props.direction??1),scale=(props.zoom??1)*pose.scale*(a.category==='hero'||a.category==='typography'?1:.88);
 const zones=[...(props.exclusionZones??[]),...(props.faceSafe?[props.faceSafe]:[])];
 const prefix=c.prefix,mask=`${prefix}-safe`,clip=`${prefix}-reveal`,blur=`${prefix}-velocity`;
 const zonesMarkup=a.category==='hero'?'':zones.map(z=>rect(z.x,z.y,z.width,z.height,'black',z.kind==='face'?Math.min(z.width,z.height)/2:6)).join('');
 const border=a.category==='hero'?48:64;
 const defs=`<defs><mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="${c.h}">${rect(border,border,1080-border*2,c.h-border*2,'white',2)}${zonesMarkup}</mask><clipPath id="${clip}">${rect(0,0,1080*pose.reveal,c.h,'white')}</clipPath><filter id="${blur}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${Math.max(0,props.blurAmount??(props.motionBlur?pose.blur:0))} 0"/></filter></defs>`;
 const trans=`translate(${pose.x} ${pose.y}) translate(${c.cx} ${c.cy}) rotate(${fmt(rot)}) scale(${fmt(scale)}) translate(${-c.cx} ${-c.cy})`;
 const filtered=(props.blurAmount??(props.motionBlur?pose.blur:0))>0&&a.category!=='typography'&&a.category!=='hero'?`filter="url(#${blur})"`:'';
 return defs+g(g(g(markup,trans,`opacity="${pose.opacity*(props.opacity??1)}" ${filtered}`),'',`clip-path="url(#${clip})"`),'',`mask="url(#${mask})"`)+(pose.flashOpacity?rect(border,border,1080-border*2,c.h-border*2,props.animationPreset==='short-vermilion-flash'?'#C9342F':'#F0D9A4',0,`opacity="${pose.flashOpacity}"`):'');
}
export function renderSvg(id:string,props:GeneratorProps={}){const a=getAsset(id),w=props.frameWidth??a.masterWidth,h=props.frameHeight??a.masterHeight;return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${a.masterWidth} ${a.masterHeight}" color-interpolation="sRGB"><g transform="scale(2)">${renderBody(id,props)}</g></svg>`;}
export function generator(name:GeneratorName,props:GeneratorProps={}){
 const defaults:Record<GeneratorName,string>={KaleidoscopeGenerator:'peacock-feather-kaleidoscope',RadialPatternGenerator:'radial-textile-pattern',OpticalTunnelGenerator:'checkerboard-tunnel',HeroEchoGenerator:'hero-echo-demo',HeroSymmetryGenerator:'hero-mirror-demo',KolamGenerator:'concentric-kolam-rings',TamilLetterRingGenerator:'Tamil-letter-ring',FolkPatternGenerator:'radial-textile-pattern',ImpactBurstGenerator:'flower-impact-ring',TransitionMaskGenerator:'kaleidoscope-iris',LyricPatternGenerator:'lyric-stamp-demo',ScreenPrintTextureGenerator:'fine-pigment-grain'};
 return renderSvg(props.variant&&(()=>{try{return !!getAsset(props.variant!)}catch{return false}})()?props.variant:defaults[name],props);
}
