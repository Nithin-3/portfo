import React,{useState,useEffect} from 'react'
import data from './data.json'
export default function Portfo(){
    const [dimensions, setDimensions] = useState(0);
    const [tog,settog] = useState(false);
    const [line,setline] = useState(0);
    const [move,setmove] = useState(80);
    const color ="#019606"
    const [disp,setdisp] = useState(null);
    const animRangeMin = 30
    const animRangeMax = 70
    useEffect(() => {
        const handleResize = () => {
            const max = Math.max(window.innerWidth,window.innerHeight)*0.4;
            const set = max < Math.min(window.innerWidth,window.innerHeight)?max:Math.min(window.innerWidth,window.innerHeight)*0.4
            setDimensions(set);
            setline(set/2);

        };
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollHeight = document.getElementById("scroll").scrollHeight - window.innerHeight;
            const scrollPercentage = Math.min(scrollPosition / scrollHeight, 1) * 100;
            const scrollPart = 100 / data.length;
            const changePercentage = (scrollPercentage%scrollPart) / scrollPart * 100
            if(changePercentage < 51){
                setmove(80 - ((changePercentage / 50) * 80))
            }else{
                setmove(((changePercentage - 50) / 50) * 80)
            }
            if(changePercentage > animRangeMin && changePercentage < animRangeMax){
                changeAline(changePercentage);
            }
            else if(changePercentage < 1 || changePercentage > 99){
                document.getElementById("aline").style.opacity=0
                document.querySelectorAll(".random-div").forEach((div)=>{
                    div.style.opacity = 0
                })
            }
            setdisp(data[Math.floor(scrollPercentage/scrollPart) >= data.length?data.length-1:Math.floor(scrollPercentage/scrollPart)])
            if(scrollPercentage === 100)window.scrollTo(0,1);
            if(scrollPercentage === 0)window.scrollTo(0,scrollHeight);
        };
        handleResize()
        window.addEventListener('resize', handleResize);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const changeAline = (val)=>{
        const normalizedValue = (val - 50) / 20; // ==> -1 -> 0 -> 1 
        const fuzzy = Math.min(1- Math.pow(normalizedValue,2)+0.5,0.95); // curve
        document.getElementById("aline").style.opacity = fuzzy
        settog(p=>{
            p && document.querySelectorAll(".random-div").forEach((div)=>{
                div.style.opacity = fuzzy
            })
            return p;
        })
       

    }
    const togelBranch = ()=>{

        settog(p=>{ 
            p && document.querySelectorAll(".random-div").forEach((div)=>{
            div.style.opacity = 0
        });
            p || document.querySelectorAll(".random-div").forEach((div)=>{
            div.style.opacity = 0.7
        });
            p || setRandomPosition();
            return !p;});
    }
    const setRandomPosition = ()=>{
        const divs = document.querySelectorAll('.random-div');
        const centerX = window.innerWidth / 2;
        const leftLimit = centerX - dimensions / 2;
        const rightLimit = centerX + dimensions / 2;
        divs.forEach(function(div) {
            let randomX = Math.random(), randomY = Math.floor(Math.random() * (window.innerHeight - div.offsetHeight));
            if (randomX < 0.5) {
                randomX = randomX * leftLimit;     } else {
                randomX = randomX * (window.innerWidth - rightLimit) + rightLimit - div.offsetWidth ; 
            }
            div.style.top = randomY + 'px';
            div.style.left = randomX + 'px';
        });
    }
    return(<div style={{height:`${data.length * 600}vh`}} id="scroll" >
        <div id="main" onClick={togelBranch}>
            <div className="omnit" style={{ height: `${dimensions}px` }} >
        <svg width={line} height={dimensions} style={{ transform: `translateX(-${move}%)`,marginLeft:`${line * 0.3}px` }}>
    {/* First diamond */}
    <polygon
      points={`${line * 0.2},0 ${line * 0.5},0 ${line},${dimensions * 0.5} ${line * 0.5},${dimensions} ${line * 0.2},${dimensions} ${line * 0.9},${dimensions * 0.5}`}
      fill={color} // The color you want to fill the diamond with
    />
  </svg>

  <svg width={line} height={dimensions} style={{ transform: `translateX(${move}%)`,marginRight:`${line *0.3}px` }}>
    {/* Second diamond */}
    <polygon
      points={`${line * 0.8},0 ${line * 0.5 },0 0,${dimensions * 0.5} ${line * 0.5},${dimensions}  ${line * 0.8},${dimensions} ${line * 0.1},${dimensions * 0.5}`}
      fill={color} // The color you want to fill the diamond with
    />
  </svg>
            </div>
            <div className="aline" id="aline">
                <div>
                    <span>{disp?.icon}</span>
                    <h2>{disp?.title}</h2>
                    <p>{disp?.description}</p>
                </div>
            </div>
            {disp?.branch.map((e,i) => (
                <div className="random-div" key={i}>
                    <span>{e.icon}</span>
                    <h2>{e.title}</h2>
                    <p>{e.description}</p>
                </div>
            )) }
        </div>
    </div>)
}
//!
    //<div className="omnit" style={{ height: ${dimensions}px }} >
//<svg width={line} height={dimensions} style={{transform: translateX(-${move}%)}} >
//                <line x1={line * 0.5} y1="0" x2={line} y2={line} stroke={color} strokeWidth={tick} />
//                 <line x1={line * 0.5} y1={dimensions} x2={line} y2={line} stroke={color} strokeWidth={tick}/>
//              </svg>
//               <svg width={line} height={dimensions} style={{transform: translateX(${move}%)}} >
//                <line x1={line * 0.5} y1="0" x2="0" y2={line} stroke={color} strokeWidth={tick} />
//                   <line x1={line * 0.5} y1={dimensions} x2="0" y2={line} stroke={color} strokeWidth={tick} />
//              </svg>
//     </div>
