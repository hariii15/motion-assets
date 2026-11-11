// Derived from the existing library utility; source retained unchanged.
export const seeded = (seed:number) => {let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};};
export const clamp=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const ease=(p:number)=>{p=clamp(p);return p*p*(3-2*p);};
