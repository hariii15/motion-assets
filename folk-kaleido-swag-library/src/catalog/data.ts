import data from '../../manifests/assets.json';
export const assets=data;
export type AssetRecord=typeof data[number];
export const getAsset=(id:string)=>{const a=assets.find(a=>a.id===id);if(!a)throw Error('Unknown asset '+id);return a;};
