import React, { useState, useEffect, useLayoutEffect, useRef, } from 'react'
import { Canvas, useFrame, useThree, } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import * as THREE from "three";
import { useNavigate } from 'react-router-dom'
import azmuth from './image2vector.svg'
export default function Portfo() {
    const [data, sdata] = useState([])
    const [dimensions, setDimensions] = useState(0);
    const [tog, settog] = useState(false);
    const [line, setline] = useState(0);
    const move = useRef(80);
    const [vis, setvis] = useState(false);
    const [rot, srot] = useState(0);
    const color = React.useMemo(() => getComputedStyle(document.documentElement).getPropertyValue('--fgD1'), []);
    const [disp, setdisp] = useState(null);
    const animRangeMin = 30;
    const animRangeMax = 70;
    const nav = useNavigate();
    const anim = useRef({ tar: { x: 0, z: 0, y: 0, zpos: 0 }, init: { x: 0, z: 0, y: 0, zpos: 0 } });
    const omnit = useRef([]);
    function Model() {
        const { nodes, materials } = useGLTF("/portfo/scene.glb");
        const mod = useRef();
        const duration = 600;
        const meshRef = useRef();
        const { camera, size } = useThree();
        const getWid = () => {
            if (!meshRef.current) return;
            const box = new THREE.Box3().setFromObject(mod.current);
            const vertices = [
                new THREE.Vector3(box.min.x, box.min.y, box.min.z),
                new THREE.Vector3(box.min.x, box.min.y, box.max.z),
                new THREE.Vector3(box.min.x, box.max.y, box.min.z),
                new THREE.Vector3(box.min.x, box.max.y, box.max.z),
                new THREE.Vector3(box.max.x, box.min.y, box.min.z),
                new THREE.Vector3(box.max.x, box.min.y, box.max.z),
                new THREE.Vector3(box.max.x, box.max.y, box.min.z),
                new THREE.Vector3(box.max.x, box.max.y, box.max.z)
            ];
            const projected = vertices.map(v => {
                const vector = v.clone().project(camera);
                return {
                    x: (vector.x * 0.5 + 0.5) * size.width,
                    y: (1 - (vector.y * 0.5 + 0.5)) * size.height
                };
            });
            const xs = projected.map(p => p.x);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            return maxX - minX
        }
        useEffect(() => {
            if (!mod.current) return;
            const start = performance.now();
            anim.current.tar = { x: rot, z: rot, y: tog ? -3 : 0, zpos: tog ? -3 : 0 };

            function animate(time) {
                if (!mod.current) return;
                const t = Math.min((time - start) / duration, 1);
                const ease = t * (2 - t); // ease-out
                mod.current.rotation.x = THREE.MathUtils.lerp(anim.current.init.x, anim.current.tar.x, ease);
                mod.current.rotation.z = THREE.MathUtils.lerp(anim.current.init.z, anim.current.tar.z, ease);
                mod.current.position.y = THREE.MathUtils.lerp(anim.current.init.y, anim.current.tar.y, ease);
                mod.current.position.z = THREE.MathUtils.lerp(anim.current.init.zpos, anim.current.tar.zpos, ease);
                if (omnit.current[2]) omnit.current[2].style.width = `${getWid()}px`
                if (t < 1) requestAnimationFrame(animate);
                else anim.current.init = { ...anim.current.tar }
            }
            requestAnimationFrame(animate);
        }, [rot])
        useFrame(() => {
            if (!omnit.current[0] || !omnit.current[1] || !omnit.current[2]) return;
            omnit.current[0].style.transform = `translateX(-${move.current}%)`
            omnit.current[1].style.transform = `translateX(${move.current}%)`
            if (tog) omnit.current[2].style.transform = 'rotateZ(10deg)'
        })
        return (
            <group ref={mod}>
                <mesh ref={meshRef} geometry={nodes.Cylinder001.geometry} material={materials.omni} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.7}>
                    <group position={[0, 0, 0]}>
                        <Html transform style={{ pointerEvents: "none" }} zIndexRange={[-1, 0]} rotation={[90, 0, 0]} scale={0.15}>
                            <div className="omnit" ref={el => omnit.current[2] = el} >
                                <svg width={line} height={line * 2} ref={el => omnit.current[0] = el} style={{ marginLeft: `${line * 0.3}px` }}>
                                    <polygon points={`${line * 0.2},0 ${line * 0.5},0 ${line},${line * 2 * 0.5} ${line * 0.5},${line * 2} ${line * 0.2},${line * 2} ${line * 0.9},${line * 2 * 0.5}`} fill={color} />
                                </svg>
                                <svg width={line} height={line * 2} ref={el => omnit.current[1] = el} style={{ marginRight: `${line * 0.3}px` }}>
                                    <polygon points={`${line * 0.8},0 ${line * 0.5},0 0,${line * 2 * 0.5} ${line * 0.5},${line * 2} ${line * 0.8},${line * 2} ${line * 0.1},${line * 2 * 0.5}`} fill={color} />
                                </svg>
                            </div>
                        </Html>
                    </group>
                </mesh>
            </group>
        );
    }
    useLayoutEffect(() => {
        fetch('/portfo/data.json')
            .then((res) => res.json())
            .then((jsonData) => {
                sdata(jsonData)
            });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const set = Math.min(window.innerWidth, window.innerHeight)
            setDimensions(set);
            setline(set / 2);
            document.documentElement.style.setProperty("--dim", `${window.innerHeight / 2 - set / 2}px`)


        };
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollHeight = document.getElementById("scroll").scrollHeight - window.innerHeight;
            const scrollPercentage = Math.min(scrollPosition / scrollHeight, 1) * 100;
            const scrollPart = 100 / data.length;
            const changePercentage = (scrollPercentage % scrollPart) / scrollPart * 100
            move.current = changePercentage < 51 ? (80 - ((changePercentage / 50) * 80)) : (((changePercentage - 50) / 50) * 80);
            if (changePercentage > animRangeMin && changePercentage < animRangeMax) {
                changeAline(changePercentage);
            }
            else if (changePercentage < 1 || changePercentage > 99) {
                document.getElementById("aline").style.opacity = 0
                document.querySelectorAll(".random-div").forEach((div) => {
                    div.style.opacity = 0
                })
            }
            setdisp(data[Math.floor(scrollPercentage / scrollPart) >= data.length ? data.length - 1 : Math.floor(scrollPercentage / scrollPart)]);
            if (scrollPercentage >= 99) window.scrollTo(0, scrollHeight * 0.01);
            else if (scrollPercentage <= 0) window.scrollTo(0, scrollHeight * 0.99);
        };
        handleResize()
        window.addEventListener('resize', handleResize);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [data]);
    const changeAline = (val) => {
        const normalizedValue = (val - 50) / 20; // ==> -1 -> 0 -> 1 
        const fuzzy = Math.min(1 - Math.pow(normalizedValue, 2) + 0.5, 0.95); // curve
        document.getElementById("aline").style.opacity = fuzzy
        settog(p => {
            p && document.querySelectorAll(".random-div").forEach((div) => {
                div.style.opacity = fuzzy
            })
            return p;
        })


    }
    const togelBranch = () => {
        settog(p => {
            p && document.querySelectorAll(".random-div").forEach((div) => {
                div.style.opacity = 0
            });
            p || document.querySelectorAll(".random-div").forEach((div) => {
                div.style.opacity = 0.7
            });
            return !p;
        });
        srot(prev => prev === Math.PI * -0.3 ? Math.PI * 0.01 : Math.PI * -0.3);
    }

    return (<div style={{ height: `${data.length * 600}vh` }} id="scroll" className='scroll'>
        <div id="main" onClick={togelBranch}>
            <div className="azmuth" >
                <span onClick={(e) => { e.stopPropagation(); setvis(p => !p) }}>
                    <img src={azmuth} alt='Azmuth' height={dimensions * 0.2} width={dimensions * 0.2} />
                </span>
                <div className={`det ${vis ? "open" : ''}`} >
                    <div onClick={() => { nav('galvanBase') }}>
                        <p>Galvan Base</p>
                    </div>
                    <div>
                        <p>Reach Out</p>
                        <div className="dropdown">
                            <a href="mailto:nithin3deve@gmail.com">󰆎&nbsp;nithin3dev@gmail.com</a><br />
                            <a href="tel:+917639824119"> +91 7639824119</a><br />
                            <a href="https://github.com/Nithin-3" target="_blank" rel="noopener noreferrer"> Github Profile</a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="omnit" style={{ height: `${dimensions}px` }}>
                <Canvas style={{ width: "100%", height: "100%" }}>
                    <ambientLight intensity={10} />
                    <Model />
                </Canvas>

            </div>
            <div className="aline" id="aline">
                {tog ? disp?.branch.map((e, i) => (
                    <div className="random-div" key={i} style={{ background: `url(${e.icon}) no-repeat center/contain`, maxWidth: `${dimensions + 60}px` }}>
                        <h2>{e.title}</h2>
                        {e.description.split('\n').map((t, i) => <p key={i}>{t}</p>)}
                        {e.link && <a href={e.link} target='_blank' rel='noreferrer' >{e.linkTitle || e.link}</a>}
                    </div>
                )) : <div style={{ background: `url(${disp?.icon}) no-repeat center/contain`, maxWidth: `${dimensions + 50}px` }}>
                    <h2>{disp?.title}</h2>
                    {disp?.description.split('\n').map((t, i) => <p key={i}>{t}</p>)}
                </div>
                }
            </div>
        </div>
    </div>)
}
