import {curve} from './easing';
import {clamp} from '../utils/random';
export type MotionPose={scale:number;rotation:number;x:number;y:number;opacity:number;reveal:number;phase:number;blur:number;paletteIndex:number;flashOpacity:number};
export function beatEnvelope(frame:number,beatFrame=15){const t=frame-beatFrame;if(t< -3||t>16)return 0;if(t<0)return -.12*curve('tension-build',(t+3)/3);if(t<2)return curve('sharp-impact',t/2);if(t<5)return 1+.06*Math.sin((t-2)/3*Math.PI);return Math.pow(1-clamp((t-5)/11),3);}
export function evaluateMotion(preset:string,progress:number,options:{loop?:boolean;intensity?:number;beatStrength?:number;still?:boolean;durationInFrames?:number}={}):MotionPose{
 const p=clamp(progress),frame=p*((options.durationInFrames??60)-1),power=options.intensity??.65,period=(1-Math.cos(p*Math.PI*2))/2;
 const beat=options.beatStrength??beatEnvelope(frame),impact=Math.max(0,beat),inset=curve('elegant-out',p),pulse=.08*period*power;
 const m:MotionPose={scale:1,rotation:0,x:0,y:0,opacity:1,reveal:1,phase:p,blur:0,paletteIndex:0,flashOpacity:0};
 if(options.still)return {...m,phase:.55};
 switch(preset){
 case'slow-kaleido-rotation':m.rotation=4*Math.sin(p*Math.PI*2)*power;m.scale=1+pulse*.3;break;
 case'beat-kaleido-pulse':m.scale=1+pulse+impact*.07*power;m.rotation=3*Math.sin(p*Math.PI*2)*power;break;
 case'kaleido-direction-reversal':m.rotation=7*Math.sin(p*Math.PI*2)*power;break;
 case'radial-zoom-punch':m.scale=1+beat*.10*power;break;
 case'optical-tunnel-push':m.scale=1+period*.08*power;break;
 case'mirrored-snap':m.reveal=curve('sharp-impact',Math.max(0,(frame-3)/9));m.scale=.95+.05*m.reveal;break;
 case'hero-echo-trail':m.x=12*Math.sin(p*Math.PI*2)*power;m.scale=1+impact*.035;break;
 case'hero-colour-shadow-impact':m.x=impact*8*power;m.scale=1+impact*.04;break;
 case'hero-contact-sheet-flash':m.opacity=.75+.25*period;break;
 case'hero-slice-shift':m.x=impact*10;m.reveal=inset;break;
 case'kolam-draw-and-burst':m.reveal=curve('elegant-out',frame/18);m.scale=.88+.12*curve('restrained-overshoot',frame/24);break;
 case'flower-ring-expansion':m.scale=options.loop?1+period*.08:.82+.18*curve('restrained-overshoot',frame/25);break;
 case'Tamil-letter-orbit':m.rotation=5*Math.sin(p*Math.PI*2)*power;break;
 case'temple-wheel-portal':m.rotation=6*Math.sin(p*Math.PI*2)*power;m.scale=1+period*.055;break;
 case'peacock-feather-open':m.scale=.85+.15*curve('elegant-out',frame/25);break;
 case'block-print-stamp':m.scale=frame<3?.94-.035*frame/3:.90+.10*curve('restrained-overshoot',(frame-3)/12);m.opacity=curve('fast-stamp',(frame-2)/4);break;
 case'colour-palette-swap':m.paletteIndex=frame<15?0:frame<30?1:frame<45?2:0;break;
 case'short-cream-flash':case'short-vermilion-flash':m.flashOpacity=frame>=15&&frame<17?.16:0;break;
 case'pattern-contract-before-drop':m.scale=frame<27?1-.13*curve('tension-build',frame/27):.87+.13*curve('heavy-settle',(frame-27)/15);break;
 case'drop-expansion':m.scale=frame<4?.80-.04*frame/4:.76+.24*curve('restrained-overshoot',(frame-4)/15);m.reveal=curve('drop-release',(frame-3)/16);break;
 case'poster-change-impact':m.scale=1+impact*.065;m.paletteIndex=frame<15?0:1;break;
 }
 // Directional blur belongs only to high-velocity movement. Holds and type stay sharp.
 m.blur=Math.min(1.2,Math.abs(beatEnvelope(frame+.5)-beatEnvelope(frame-.5))*3*power);
 return m;
}
export type Beat={frame:number;strength:number;type?:'regular'|'strong'|'drop'};
export const evaluateBeatMap=(frame:number,map:Beat[])=>Math.max(0,...map.map(b=>Math.max(0,beatEnvelope(frame,b.frame))*b.strength));
