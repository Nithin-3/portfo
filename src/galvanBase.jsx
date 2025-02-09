import React from 'react'
import {useNavigate} from 'react-router-dom'
export default function GalvanBase(){
    const nav = useNavigate();
    const images = require.context('../public/img', false, /\.(jpg|jpeg|png|gif)$/);
    console.log(images.keys());
    return (<div className="base-root">
        <span onClick={()=>{nav('/')}} >〉〈</span>
        <div>
            <div>
                <div>img</div>
                <p>󰖋</p>
            </div>
        </div>
    </div>)
}
