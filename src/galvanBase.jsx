import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function GalvanBase() {
    const nav = useNavigate();
    const [images, setImages] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null); // { sources: [], index: 0, type: '', head: '' }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/portfo/galven/images.json')
            .then(res => res.json())
            .then(data => {
                setImages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch images:", err);
                setLoading(false);
            });
    }, []);

    const color = getComputedStyle(document.documentElement).getPropertyValue('--fgD1');

    const handleMediaClick = (sources, index, type, head) => {
        setSelectedMedia({ sources, index, type, head });
    };

    const closeLightbox = () => {
        setSelectedMedia(null);
    };

    const navigateLightbox = (dir) => {
        if (!selectedMedia) return;
        const newIndex = (selectedMedia.index + dir + selectedMedia.sources.length) % selectedMedia.sources.length;
        setSelectedMedia({ ...selectedMedia, index: newIndex });
    };

    return (
        <div className="base-root">
            <span onClick={() => { nav('/') }} className="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={color}>
                    <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                </svg>
                BACK TO HUB
            </span>

            <div className="galven-root">
                {loading ? (
                    <div className="loading-state">
                        <div className="scanner"></div>
                        <p>INITIALIZING DATABASE...</p>
                    </div>
                ) : (
                    images.map((v, i) => (
                        <div className="galven-section" key={i}>
                            <h2 data-text={v.cat}>{v.cat}</h2>

                            <div className="galven-grid">
                                {v.list.map((item, index) => {
                                    const srcList = [].concat(item.source);
                                    return (
                                        <div className="galven-card" key={index}>
                                            <div className="media-container">
                                                {srcList.map((src, idx) => (
                                                    <MediaItem
                                                        key={idx}
                                                        src={src}
                                                        type={item.type}
                                                        head={item.head}
                                                        onClick={() => handleMediaClick(srcList, idx, item.type, item.head)}
                                                        isFirst={idx === 0}
                                                        isMulti={srcList.length > 1}
                                                    />
                                                ))}
                                                {srcList.length > 1 && (
                                                    <div className="multi-indicator">
                                                        <span>{srcList.length} ITEMS</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="card-info">
                                                <h3>{item.head}</h3>
                                                <div className="card-decoration">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedMedia && (
                <div className="lightbox" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeLightbox}>&times;</button>

                        {selectedMedia.sources.length > 1 && (
                            <>
                                <button className="nav-btn prev" onClick={() => navigateLightbox(-1)}>&#10094;</button>
                                <button className="nav-btn next" onClick={() => navigateLightbox(1)}>&#10095;</button>
                                <div className="counter">{selectedMedia.index + 1} / {selectedMedia.sources.length}</div>
                            </>
                        )}

                        <LightboxMedia
                            src={selectedMedia.sources[selectedMedia.index]}
                            type={selectedMedia.type}
                            head={selectedMedia.head}
                        />

                        <div className="lightbox-caption">
                            <h3>{selectedMedia.head}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function LightboxMedia({ src, type, head }) {
    const isVideo = type === 'vid' || type === 'video' || src.endsWith('.mp4') || src.endsWith('.webm');
    const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');

    if (isYoutube) {
        const videoId = src.split('v=')[1] || src.split('/').pop();
        return (
            <iframe
                width="100%"
                height="500px"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={head}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        );
    }

    if (isVideo) {
        return <video src={src} controls autoPlay />;
    }

    return <img src={src} alt={head} />;
}

function MediaItem({ src, type, head, onClick, isFirst, isMulti }) {
    const videoRef = useRef(null);
    const isVideo = type === 'vid' || type === 'video' || src.endsWith('.mp4') || src.endsWith('.webm');

    const handleMouseEnter = () => {
        if (isVideo) {
            videoRef.current?.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        if (isVideo) {
            videoRef.current?.pause();
            if (videoRef.current) videoRef.current.currentTime = 0;
        }
    };

    // If it's multi-image, only show the first one in the card
    if (isMulti && !isFirst) return null;

    return (
        <div
            className="media-wrapper"
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={src}
                    muted
                    loop
                    playsInline
                    className="preview-video"
                />
            ) : (
                <img src={src} alt={head} loading="lazy" />
            )}
            <div className="media-overlay">
                <div className="view-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T34-500q66-137 186-218.5T480-800q146 0 266 81.5T926-500q-66 137-186 218.5T480-200Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
