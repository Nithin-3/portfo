import "./all.css"
import {BrowserRouter as Rout , Routes,Route} from 'react-router-dom'
import Portfo from './portfo'
import GalvanBase from './galvanBase'
function App() {
  return (
        <Rout>
            <Routes>
                <Route path='/' element={<Portfo/>}/>
                <Route path='galvanBase' element={<GalvanBase/>}/>
                <Route path='*' element={<Portfo/>}/>
            </Routes>
        </Rout>
  );
}

export default App;
