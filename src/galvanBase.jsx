import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function GalvanBase() {
    const nav = useNavigate();
    const [images, setImages] = useState([]);
    useEffect(() => {
        fetch('/portfo/galven/images.json')
            .then(res => res.json())
            .then(setImages)
    }, []);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--fgD1');

    return (<div className="base-root">
        <span onClick={() => { nav('/') }} > &nbsp;&nbsp;&nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={color}><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
        </span>
        <div className="galven-root">
            {images.map((v, i) => (
                <div className="galven-section" key={i}>
                    <h2>{v.cat}</h2>

                    <div className="galven-grid">
                        {v.list.map((item, index) => {
                            const srcList = [].concat(item.source);
                            return (
                                <div className="galven-card" key={index}>
                                    {srcList.map((src, idx) =>
                                        item.type === "img" ? (
                                            <img key={idx} src={src} alt={item.head} />
                                        ) : (
                                            <video key={idx} src={src} controls />
                                        )
                                    )}
                                    <h3>{item.head}</h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </div>)
}
