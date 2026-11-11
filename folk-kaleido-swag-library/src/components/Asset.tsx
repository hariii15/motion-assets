import React,{useId} from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {getAsset} from '../catalog/data';
import {renderBody} from '../generators/engine';
import type {GeneratorProps} from '../generators/types';
export type AssetProps=GeneratorProps&{id:string};
export const Asset:React.FC<AssetProps>=({id,...props})=>{const key=useId(),a=getAsset(id);return <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${a.masterWidth} ${a.masterHeight}`} style={{width:'100%',height:'100%'}}><g transform="scale(2)" dangerouslySetInnerHTML={{__html:renderBody(id,{...props,instanceId:props.instanceId??key})}}/></svg>;};
export const RemotionAsset:React.FC<AssetProps>=(props)=>{const frame=useCurrentFrame(),{fps}=useVideoConfig();return <Asset {...props} frame={props.frame??frame} fps={fps}/>;};
