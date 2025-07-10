import "./all.css"
import { Routes, Route } from 'react-router-dom'
import Portfo from './portfo'
import GalvanBase from './galvanBase'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Portfo />} />
      <Route path='/galvanBase' element={<GalvanBase />} />
      <Route path='*' element={<Portfo />} />
    </Routes>
  );
}

export default App;

