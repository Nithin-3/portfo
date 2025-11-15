import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas, useThree } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import * as THREE from "three";
import { useNavigate } from 'react-router-dom'
import azmuth from './image2vector.svg'

export default function Portfo() {
    const [data, sdata] = useState([])
    const [dimensions, setDimensions] = useState(0);
    const [tog, settog] = useState(false);
    const [vis, setvis] = useState(false);
    const [rot, srot] = useState(0);
    const [disp, setdisp] = useState(null);

    const omnit = useRef([]);
    const move = useRef(80);
    const anim = useRef({ tar: { x: 0, z: 0, y: 0, zpos: 0 }, init: { x: 0, z: 0, y: 0, zpos: 0 } });
    const widRef = useRef(0);

    const color = React.useMemo(() => getComputedStyle(document.documentElement).getPropertyValue('--fgD1'), []);
    const nav = useNavigate();

    function Model() {
        const { nodes, materials } = useGLTF("/portfo/scene.glb");
        const mod = useRef();
        const { camera, size } = useThree();
        const duration = 500;

        const getWid = () => {
            if (!mod.current) return widRef.current;
            const box = new THREE.Box3().setFromObject(mod.current);
            const v = [
                new THREE.Vector3(box.min.x, box.min.y, box.min.z),
                new THREE.Vector3(box.min.x, box.min.y, box.max.z),
                new THREE.Vector3(box.min.x, box.max.y, box.min.z),
                new THREE.Vector3(box.min.x, box.max.y, box.max.z),
                new THREE.Vector3(box.max.x, box.min.y, box.min.z),
                new THREE.Vector3(box.max.x, box.min.y, box.max.z),
                new THREE.Vector3(box.max.x, box.max.y, box.min.z),
                new THREE.Vector3(box.max.x, box.max.y, box.max.z)
            ];
            const p = v.map(x => {
                const h = x.clone().project(camera);
                return (h.x * 0.5 + 0.5) * size.width;
            });
            const w = Math.max(...p) - Math.min(...p);
            const mob = window.innerWidth < 768 || window.innerHeight < 768;
            return mob ? Math.max(w * 0.6, dimensions) : Math.min(w * 0.5, dimensions);
        };

        const updateWidth = () => {
            widRef.current = getWid();
            if (omnit.current[2]) omnit.current[2].style.width = widRef.current + "px";
        };

        useEffect(updateWidth, [dimensions]);

        useEffect(() => {
            if (!mod.current) return;
            const start = performance.now();
            anim.current.tar = { x: rot, z: rot, y: tog ? -3 : 0, zpos: tog ? -3 : 0 };

            const run = (t) => {
                if (!mod.current) return;
                const k = Math.min((t - start) / duration, 1);
                const e = k * (2 - k);
                mod.current.rotation.x = THREE.MathUtils.lerp(anim.current.init.x, anim.current.tar.x, e);
                mod.current.rotation.z = THREE.MathUtils.lerp(anim.current.init.z, anim.current.tar.z, e);
                mod.current.position.y = THREE.MathUtils.lerp(anim.current.init.y, anim.current.tar.y, e);
                mod.current.position.z = THREE.MathUtils.lerp(anim.current.init.zpos, anim.current.tar.zpos, e);
                if (k < 1) requestAnimationFrame(run);
                else {
                    anim.current.init = { ...anim.current.tar };
                    updateWidth();
                }
            };
            requestAnimationFrame(run);
        }, [rot]);

        useEffect(() => {
            let f;
            const loop = () => {
                if (omnit.current[0]) omnit.current[0].style.transform = `translateX(-${move.current}%)`;
                if (omnit.current[1]) omnit.current[1].style.transform = `translateX(${move.current}%)`;
                if (tog && omnit.current[2]) omnit.current[2].style.transform = 'translate(-25%, -16%)';
                f = requestAnimationFrame(loop);
            };
            loop();
            return () => cancelAnimationFrame(f);
        }, [tog]);

        return (
            <group ref={mod}>
                <group rotation={[Math.PI / 2, 0, 0]} scale={9.371}>
                    <mesh geometry={nodes.Circle001.geometry} material={materials['Material.002']} />
                    <mesh geometry={nodes.Circle001_1.geometry} material={materials.omni} />
                </group>
                <Html transform style={{ pointerEvents: "none" }} zIndexRange={[-3, -2]} scale={0.15}>
                    <div className="omnit" ref={el => omnit.current[2] = el}>
                        <svg viewBox="0 0 100 200" preserveAspectRatio="none" ref={el => omnit.current[0] = el}>
                            <polygon points="20,0 50,0 100,100 50,200 20,200 90,100" fill={color} />
                        </svg>
                        <svg viewBox="0 0 100 200" preserveAspectRatio="none" ref={el => omnit.current[1] = el}>
                            <polygon points="80,0 50,0 0,100 50,200 80,200 10,100" fill={color} />
                        </svg>
                    </div>
                </Html>
            </group>
        );
    }

    useLayoutEffect(() => {
        fetch('/portfo/data.json')
            .then(r => r.json())
            .then(j => sdata(j));
    }, []);

    useEffect(() => {
        const resize = () => {
            const d = Math.min(window.innerWidth, window.innerHeight);
            setDimensions(d);
            document.documentElement.style.setProperty("--dim", `${window.innerHeight / 2 - d / 2}px`);
        };

        let ticking = false;
        const scroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const h = document.getElementById("scroll").scrollHeight - window.innerHeight;
                const y = window.scrollY;
                const p = Math.min(y / h, 1) * 100;
                const each = 100 / data.length;
                const c = (p % each) / each * 100;

                move.current = c < 51 ? 30 + (c * 0.8) : 70 - ((c - 50) * 0.8);

                if (c > 30 && c < 70) {
                    const n = (c - 50) / 20;
                    const f = Math.min(1 - n * n + 0.5, 0.95);
                    const a = document.getElementById("aline");
                    if (a) a.style.opacity = f;
                    if (tog) {
                        const r = document.querySelectorAll(".random-div");
                        r.forEach(x => x.style.opacity = f);
                    }
                } else {
                    const a = document.getElementById("aline");
                    if (a) a.style.opacity = 0;
                    const r = document.querySelectorAll(".random-div");
                    r.forEach(x => x.style.opacity = 0);
                }

                const idx = Math.floor(p / each);
                setdisp(data[idx >= data.length ? data.length - 1 : idx]);

                if (p >= 99) window.scrollTo(0, h * 0.01);
                else if (p <= 0) window.scrollTo(0, h * 0.99);

                ticking = false;
            });
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("scroll", scroll);
        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("scroll", scroll);
        };
    }, [data]);

    const togelBranch = () => {
        settog(p => {
            const r = document.querySelectorAll(".random-div");
            r.forEach(x => x.style.opacity = p ? 0 : 0.7);
            return !p;
        });
        srot(r => r === Math.PI * -0.3 ? 0.01 * Math.PI : -0.3 * Math.PI);
    };

    return (
        <div style={{ height: `${data.length * 600}vh` }} id="scroll" className="scroll">
            <div id="main" onClick={togelBranch}>
                <div className="azmuth">
                    <span onClick={e => { e.stopPropagation(); setvis(v => !v); }}>
                        <img src={azmuth} alt="Azmuth" height={dimensions * 0.1} width={dimensions * 0.1} />
                    </span>
                    <div className={`det ${vis ? "open" : ""}`}>
                        <div onClick={() => nav("galvanBase")}><p>Galvan Base</p></div>
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

                <div id="omnit" style={{ height: dimensions + "px" }}>
                    <Canvas style={{ width: "100%", height: "100%" }}>
                        <ambientLight intensity={10} />
                        <Model />
                    </Canvas>
                </div>

                <div className="aline" id="aline">
                    {tog ? disp?.branch.map((e, i) => (
                        <div className="random-div" key={i} style={{ background: `url(${e.icon}) no-repeat center/contain`, maxWidth: dimensions + 60 + "px" }}>
                            <h2>{e.title}</h2>
                            {e.description.split('\n').map((t, j) => <p key={j}>{t}</p>)}
                            {e.link && <a href={e.link} target="_blank" rel="noreferrer">{e.linkTitle || e.link}</a>}
                        </div>
                    )) : (
                        <div style={{ background: `url(${disp?.icon}) no-repeat center/contain`, maxWidth: dimensions + 50 + "px" }}>
                            <h2>{disp?.title}</h2>
                            {disp?.description.split('\n').map((t, i) => <p key={i}>{t}</p>)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
