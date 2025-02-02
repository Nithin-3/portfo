import React from 'react'
import {useNavigate} from 'react-router-dom'
export default function GalvanBase(){
    const nav = useNavigate()
    return (<div className="base-root">
        <span onClick={()=>{nav('/')}}>back</span>
        <div>
            <div>
                <div>img</div>
                <p>󰖋</p>
            </div>
        </div>
    </div>)
}
