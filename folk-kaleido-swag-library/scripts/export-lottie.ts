import {writeFileSync} from 'node:fs';
import {assets} from '../src/catalog/data';
import {evaluateMotion} from '../src/animations/motion';
import {circleRadii} from '../src/generators/engine';
import {dirs} from './shared';
dirs();
for(const a of assets.filter(a=>a.lottieCompatible)){
 const sample=(fn:(f:number)=>number[])=>({a:1,k:Array.from({length:60},(_,f)=>({t:f,s:fn(f),e:fn(Math.min(59,f+1)),i:{x:.667,y:.667},o:{x:.333,y:.333}}))});
 const pose=(f:number)=>evaluateMotion(a.animationPreset,f/59,{loop:a.loop}),color=(s:string)=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255).concat(1);
 const j={v:'5.7.4',nm:a.id,fr:30,ip:0,op:60,w:2160,h:2160,ddd:0,assets:[],layers:[{ty:4,ind:1,nm:a.id,sr:1,ddd:0,ks:{p:sample(f=>[1080+pose(f).x*2,1080+pose(f).y*2,0]),a:{a:0,k:[0,0,0]},s:sample(f=>[88*pose(f).scale,88*pose(f).scale,100]),r:sample(f=>[pose(f).rotation]),o:sample(f=>[pose(f).opacity*100])},shapes:circleRadii.map((r,i)=>({ty:'gr',it:[{ty:'el',d:1,p:{a:0,k:[0,0]},s:{a:0,k:[r*4,r*4]},nm:'circle'},{ty:'st',c:{a:0,k:color([a.palette[0],a.palette[1],a.palette[3]][i])},o:{a:0,k:100},w:{a:0,k:(i===1?13:7)*2},lc:1,lj:1},{ty:'tr',p:{a:0,k:[0,0]},a:{a:0,k:[0,0]},s:{a:0,k:[100,100]},r:{a:0,k:0},o:{a:0,k:100},sk:{a:0,k:0},sa:{a:0,k:0}}]})),ip:0,op:60,st:0,bm:0}]};
 writeFileSync(a.lottiePath!,JSON.stringify(j));
}
console.log('3 exact vector-circle Lottie exports');
