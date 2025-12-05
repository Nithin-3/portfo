import { useState, useEffect, useLayoutEffect, useRef, useMemo, } from 'react'
import { Canvas, } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { Shape, ShapeGeometry, MeshBasicMaterial } from "three"
import { useNavigate } from 'react-router-dom'
import azmuth from './image2vector.svg'
import { useSpring, a } from '@react-spring/three';

export default function Portfo() {

    const [data, sdata] = useState([])
    const [dimensions, setDimensions] = useState(0);
    const [tog, settog] = useState(false);
    const [vis, setvis] = useState(false);
    const [rot, srot] = useState(Math.PI * 0.01);
    const [disp, setdisp] = useState(null);
    const [moveS, smoveS] = useState(0);

    const aline = useRef();
    const srlPer = useRef(0);
    const lstIdx = useRef(-1);

    const color = useMemo(() => getComputedStyle(document.documentElement).getPropertyValue('--fgD1'), []);

    const nav = useNavigate();
    const { rx, rz, py, pz, move } = useSpring({
        rx: rot,
        rz: rot,
        py: tog ? -3 : 0,
        pz: tog ? -1.5 : 0,
        move: moveS,
        config: { tension: 120, friction: 18 }
    });
    const shape = useMemo(() => {
        const s = new Shape();
        s.moveTo(20, 0)
        s.lineTo(50, 0)
        s.lineTo(100, 100)
        s.lineTo(50, 200)
        s.lineTo(20, 200)
        s.lineTo(90, 100)
        s.closePath()
        return s
    }, []);
    const shape2 = useMemo(() => {
        const s = new Shape();
        s.moveTo(80, 0)
        s.lineTo(50, 0)
        s.lineTo(0, 100)
        s.lineTo(50, 200)
        s.lineTo(80, 200)
        s.lineTo(10, 100)
        s.closePath()
        return s
    }, []);

    const geom = useMemo(() => new ShapeGeometry(shape), [shape]);
    const geomMir = useMemo(() => new ShapeGeometry(shape2), [shape2]);
    const mat = useMemo(() => new MeshBasicMaterial({ color, transparent: true }), [color]);
    const { nodes, materials } = useGLTF("/portfo/scene.glb");

    function Model() {
        return (
            <a.group rotation-x={rx} rotation-z={rz} position-y={py} position-z={pz}>
                <group rotation={[Math.PI / 2, 0, 0]} scale={9.371}>
                    <mesh geometry={nodes.Circle001.geometry} material={materials['Material.002']} />
                    <mesh geometry={nodes.Circle001_1.geometry} material={materials.omni} />
                </group>
                <group scale={0.015} position={[-0.7, -1.5, 1]} >
                    <a.group position-x={move.to(v => -v)}>
                        <mesh geometry={geom} material={mat} />
                    </a.group>
                    <a.group position-x={move}>
                        <mesh geometry={geomMir} material={mat} />
                    </a.group>
                </group>
            </a.group>
        );
    }
    useLayoutEffect(() => {
        fetch('/portfo/data.json')
            .then((res) => res.json())
            .then((jsonData) => {
                sdata(jsonData)
                setdisp(jsonData[0])
            });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const set = Math.min(window.innerWidth, window.innerHeight)
            setDimensions(set);
        };
        handleResize()
        window.addEventListener('resize', handleResize);
        return window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        let rafId;

        const update = (p) => {
            const each = 100 / data.length;
            const idx = Math.floor(p / each);
            if (lstIdx.current !== idx) {
                lstIdx.current = idx;
                setdisp(data[idx]);
            }
            const c = (p % each) / each * 100;
            smoveS(-20 + (1 - Math.abs(c - 50) / 50) * 90);
            if (c > 30 && c < 70) {
                const n = (c - 50) / 20;
                const f = Math.min(1 - n * n + 0.2, 0.95);
                aline.current.style.opacity = f;
            } else {
                aline.current.style.opacity = 0;
            }
        };

        let deltaBuffer = 0;
        let touchStartY = 0;

        const onWheel = (e) => {
            e.preventDefault();
            deltaBuffer += Math.sign(e.deltaY) * (Math.pow(Math.min(Math.abs(e.deltaY), 80) / 80, 2)) * 1;
        };

        const onTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
            const delta = touchStartY - e.touches[0].clientY;
            touchStartY = e.touches[0].clientY;
            deltaBuffer += delta * 0.01; // adjust sensitivity
        };

        const loop = () => {
            // Apply delta with friction for smooth motion
            srlPer.current += deltaBuffer;
            deltaBuffer *= 0.56; // friction

            const pct = ((srlPer.current % 100) + 100) % 100;
            update(pct);

            rafId = requestAnimationFrame(loop);
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: false });
        window.addEventListener("touchmove", onTouchMove, { passive: false });

        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, [data]);

    const togelBranch = () => {
        settog(p => {
            aline.current.style.opacity = p ? 0 : 0.7;
            return !p;
        });
        srot(prev => prev === Math.PI * -0.3 ? Math.PI * 0.01 : Math.PI * -0.3);
    }

    return (<div id="main" onClick={togelBranch}>
        <div className="azmuth" >
            <span onClick={(e) => { e.stopPropagation(); setvis(p => !p) }}>
                <img src={azmuth} alt='Azmuth' height={dimensions * 0.1} width={dimensions * 0.1} />
            </span>
            <div className={`det ${vis ? "open" : ''}`} >
                <div>
                    <p onClick={() => { nav('galvanBase') }}>Galvan Base</p>
                    <h3>Reach Out</h3>
                    <div className="dropdown">
                        <a href="mailto:nithin3deve@gmail.com">󰆎&nbsp;nithin3dev@gmail.com</a><br />
                        <a href="tel:+917639824119"> +91 7639824119</a><br />
                        <a href="https://github.com/Nithin-3" target="_blank" rel="noopener noreferrer"> Github Profile</a>
                    </div>
                </div>
            </div>
        </div>
        <div id="omnit" style={{ height: `${dimensions}px` }}>
            <Canvas style={{ width: "100%", height: "100%" }} dpr={Math.min(window.devicePixelRatio, 1.5)}>
                <ambientLight intensity={10} />
                <Model />
            </Canvas>

        </div>
        <div className="aline" id="aline" ref={aline}>
            {tog ? disp?.branch.map((e, i) => (
                <div key={i} style={{ background: `url(${e.icon}) no-repeat center/contain` }}>
                    <h2>{e.title}</h2>
                    <ul>
                        {e.description.split('\n').map((t, i) => <li key={i}>▸ {t}</li>)}
                    </ul>
                    {e.link && <a href={e.link} target='_blank' rel='noreferrer' >{e.linkTitle || e.link}</a>}
                </div>
            )) : <div style={{ background: `url(${disp?.icon}) no-repeat center/contain` }}>
                <h2>{disp?.title}</h2>
                <ul>
                    {disp?.description.split('\n').map((t, i) => <li key={i}>▸ {t}</li>)}
                </ul>
            </div>
            }
        </div>
    </div>)
}
