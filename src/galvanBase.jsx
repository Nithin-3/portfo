import React from 'react'
import {useNavigate} from 'react-router-dom'
export default function GalvanBase(){
    const nav = useNavigate();
    const images = require.context('../public/galven/', false, /\.(jpg|jpeg|png|gif|svg)$/);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--fgD1');
    const width = Math.min(window.innerWidth,window.innerHeight)*0.6
    const getVal = (v)=>{
        const val = v.split("~~").slice(1).join("~~")
        return val.slice(0,val.lastIndexOf('.'));
    }
    return (<div className="base-root">
        <span onClick={()=>{nav('/')}} > &nbsp;&nbsp;&nbsp;
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={color}><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
</span>
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly',gap:20}}>
            {images.keys().map((v,i)=><a href={v.split('~~')[0] || '#'} key={i} target='_blank' rel='noreferrer'>
                <div style={{background:`url(./galven/${v}) no-repeat center/contain`,aspectRatio:1,width }} className='galven-data'>
                    <p>{getVal(v)}</p>
                </div>
            </a>)}
        </div>
    </div>)
}
