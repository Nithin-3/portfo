import react,{useState,useEffect} from 'react'
export default ()=>{
    const [dimensions, setDimensions] = useState(0);
    const [line,setline] = useState(0);
    const [move,setmove] = useState(75);
    const color ="#019606"
    const tick = 6
    useEffect(() => {
        const handleResize = () => {
            const max = Math.max(window.innerWidth,window.innerHeight)*0.4;
            const set = max < Math.min(window.innerWidth,window.innerHeight)?max:Math.min(window.innerWidth,window.innerHeight)*0.4
            setDimensions(set);
            setline(set/2)
        };
          const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollHeight = document.getElementById("scroll").scrollHeight - window.innerHeight;
            const scrollPercentage = Math.min(scrollPosition / scrollHeight, 1);
            const fuzzy = (100 - scrollPercentage *100) * 0.75
            setmove(fuzzy);
        };
        handleResize()
        window.addEventListener('resize', handleResize);
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return(<div style={{height:`300vh`}} id="scroll" >
        <div id="main">
            <div className="omnit" style={{ height: `${dimensions}px` }} >
                <svg width={line} height={dimensions} style={{transform: `translateX(-${move}%)`}} >
                    <line x1="0" y1="0" x2={line} y2={line} stroke={color} strokeWidth={tick} />
                    <line x1="0" y1={dimensions} x2={line} y2={line} stroke={color} strokeWidth={tick}/>
                </svg>
                <svg width={line} height={dimensions} style={{transform: `translateX(${move}%)`}} >
                    <line x1={line} y1="0" x2="0" y2={line} stroke={color} strokeWidth={tick} />
                    <line x1={line} y1={dimensions} x2="0" y2={line} stroke={color} strokeWidth={tick} />
                </svg>
            </div>
        </div>
    </div>)
}
