import {path,circle,rect,g,repeat} from '../utils/svg';
export const segmentIds=['peacock-feather-segment','kolam-wedge-01','kolam-wedge-02','temple-car-wheel-segment','lotus-petal-segment','jasmine-chain-segment','textile-diamond-segment','banana-leaf-segment','folk-flame-segment','ornamental-eye-segment','painted-arrow-segment','Tamil-letter-segment','mural-brush-segment','parai-rhythm-segment','flower-chain-segment','temple-arch-segment'];
export function segment(id:string,a:string,b:string,c:string,stroke=3):string{
 const petal=path('M0 -155C-35 -210 -77 -330 0 -455C77 -330 35 -210 0 -155Z',a,c,stroke);
 switch(id){
 case'peacock-feather-segment':return petal+path('M0 -175V-410','none',b,2)+`<ellipse cx="0" cy="-335" rx="28" ry="48" fill="${b}"/><ellipse cx="0" cy="-335" rx="14" ry="27" fill="${c}"/>`+circle(0,-340,6,a);
 case'kolam-wedge-01':return path('M0 -150C-52 -220 52 -230 0 -285C-58 -340 -54 -400 0 -440C54 -400 58 -340 0 -285C-52 -230 52 -220 0 -150','none',a,stroke+2)+repeat(4,i=>circle(0,-205-i*62,4,b));
 case'kolam-wedge-02':return path('M0 -160L-42 -320L0 -440L42 -320ZM0 -210C65 -300 -65 -355 0 -405','none',a,stroke+1)+circle(0,-320,17,'none',b,stroke)+circle(0,-320,4,c);
 case'temple-car-wheel-segment':return path('M-9 -150L-20 -430H20L9 -150Z',a,c,stroke)+rect(-24,-438,48,20,b,3)+path('M-38 -395Q0 -415 38 -395M-32 -360Q0 -380 32 -360','none',b,4)+circle(0,-250,8,c);
 case'lotus-petal-segment':return petal+path('M0 -170Q-28 -270 0 -390Q28 -270 0 -170Z',b,c,2)+circle(0,-430,4,c);
 case'jasmine-chain-segment':return path('M0 -150V-450','none',c,3)+repeat(7,i=>{const y=-185-i*39;return repeat(5,j=>g(path(`M0 ${y}q-18 -14 0 -29q18 15 0 29`,i%2?a:b,c,1),`rotate(${j*72} 0 ${y})`))+circle(0,y,3,c);});
 case'textile-diamond-segment':return repeat(4,i=>{const y=-195-i*73;return path(`M0 ${y-28}L${18+i*7} ${y}L0 ${y+28}L${-18-i*7} ${y}Z`,i%2?a:b,c,2)+circle(0,y,4,c);});
 case'banana-leaf-segment':return petal+path('M0 -170V-435','none',b,3)+repeat(7,i=>path(`M0 ${-200-i*30}l${i%2?1:-1} 0m${i%2?-38:38} -25L0 ${-200-i*30}`,'none',b,1.6));
 case'folk-flame-segment':return path('M0 -155C-68 -245 27 -295 0 -450C82 -340 58 -230 0 -155Z',a,c,3)+path('M0 -180Q-26 -265 10 -325Q30 -245 0 -180Z',b,c,2);
 case'ornamental-eye-segment':return path('M0 -220Q-60 -335 0 -425Q60 -335 0 -220Z',a,c,2)+`<ellipse cx="0" cy="-325" rx="21" ry="48" fill="${b}"/>`+circle(0,-325,11,c)+path('M0 -180V-210M0 -440V-460','none',b,3);
 case'painted-arrow-segment':return path('M-10 -165L-12 -350L-45 -335L0 -440L45 -335L12 -350L10 -165Z',a,c,2)+path('M0 -200V-350','none',b,3);
 case'Tamil-letter-segment':return path('M-14 -180C-40 -210 42 -225 15 -270C-26 -325 -35 -345 -5 -376C27 -412 40 -365 5 -340M-14 -408Q-20 -447 28 -442','none',a,11)+path('M-14 -176Q10 -160 23 -182','none',b,4);
 case'mural-brush-segment':return path('M-8 -165C-34 -205 12 -260 -28 -310C-64 -360 -25 -408 18 -450L38 -425C0 -365 5 -350 28 -300C50 -245 4 -195 16 -170Z',a,c,2)+path('M0 -215Q15 -290 -12 -340Q-26 -385 15 -425','none',b,4);
 case'parai-rhythm-segment':return repeat(5,i=>{const r=12+i*5,y=-190-i*53;return circle(0,y,r,i%2?a:b,c,2)+circle(0,y,r*.57,'none',c,2);})+path('M-8 -180L-20 -440M8 -180L20 -440','none',c,2);
 case'flower-chain-segment':return repeat(4,i=>{const y=-210-i*70,r=17+i*5;return repeat(6,j=>g(path(`M0 ${y}q${-r} ${-r} 0 ${-r*2}q${r} ${r} 0 ${r*2}Z`,i%2?a:b,c,1),`rotate(${j*60} 0 ${y})`))+circle(0,y,5,c);});
 case'temple-arch-segment':return path('M-36 -210V-350Q-30 -430 0 -450Q30 -430 36 -350V-210','none',a,9)+path('M-22 -210V-350Q-20 -400 0 -420Q20 -400 22 -350V-210','none',b,4)+rect(-41,-215,16,16,c)+rect(25,-215,16,16,c);
 default:throw Error('Unknown source segment '+id);
 }
}
