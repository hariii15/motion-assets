export const esc=(v:string)=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
export const fmt=(n:number)=>Number(n.toFixed(4));
export const path=(d:string,fill='none',stroke='none',w=2,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export const circle=(x:number,y:number,r:number,fill='none',stroke='none',w=2,extra='')=>`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;
export const rect=(x:number,y:number,w:number,h:number,fill:string,rx=0,extra='')=>`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${rx}" fill="${fill}" ${extra}/>`;
export const g=(s:string,t='',extra='')=>`<g transform="${t}" ${extra}>${s}</g>`;
export const repeat=(n:number,fn:(i:number)=>string)=>Array.from({length:Math.max(0,Math.floor(n))},(_,i)=>fn(i)).join('');
export const TAU=Math.PI*2;
