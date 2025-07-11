import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
export default function GalvanBase(){
    const nav = useNavigate();
    const [images, setImages] = useState([]);
    useEffect(() => {
        fetch('/portfo/galven/images.json')
            .then(res => res.json())
            .then(setImages)
    }, []);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--fgD1');
    const width = Math.min(window.innerWidth,window.innerHeight)*0.6
   return (<div className="base-root">
        <span onClick={()=>{nav('/')}} > &nbsp;&nbsp;&nbsp;
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={color}><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
</span>
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly',gap:20}}>
            {images.map((v,i)=>v.link?<a href={v.link} key={i} target={'_blank'} rel='noreferrer'>
                <div style={{background:`url("https://nithin-3.github.io/portfo/galven/icon.png") no-repeat center/contain`,aspectRatio:1,width }} className='galven-data'>
                    <p>{v.content}</p>
                </div>
            </a>:<div href={v.link} key={i} target={'_blank'} rel='noreferrer'>
                <div style={{background:`url("https://nithin-3.github.io/portfo/galven/icon.png") no-repeat center/contain`,aspectRatio:1,width }} className='galven-data'>
                    <p>{v.content}</p>
                </div>
            </div>)}
        </div>
    </div>)
}
