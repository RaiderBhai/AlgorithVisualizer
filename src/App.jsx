import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import Landing from './components/landing'
import Integer from "./components/Integer"
import Pair from "./components/Pair"
import IntegerRun from './components/IntegerRun';
import PairRun from './components/PairRun';

function App() {

  const [algorithm,setAlgorithm] = useState("Landing");
  const [mul,setMul] = useState([0,0]);
  const [points,setCoord] = useState([]);
  
  const mulClick = (n1,n2)=>{
    setMul([n1,n2]);
    setAlgorithm("IRun");
  }

  const pairClick = (testarr)=>{
    setCoord(testarr);
    setAlgorithm("PRun");
  }

  return (
    <>
      {algorithm === "Landing" && <Landing algorithm={algorithm} setAlgorithm={setAlgorithm}></Landing>}
      {algorithm === "Integer" && <Integer algorithm={algorithm} setAlgorithm={setAlgorithm} mul={mul} mulClick={mulClick}></Integer>}
      {algorithm === "Pair" && <Pair algorithm={algorithm} setAlgorithm={setAlgorithm} points={points} pairClick={pairClick}></Pair>}
      {algorithm === "IRun" && <IntegerRun algorithm={algorithm} setAlgorithm={setAlgorithm} mul={mul} mulClick={mulClick}></IntegerRun>}
      {algorithm === "PRun" && <PairRun algorithm={algorithm} setAlgorithm={setAlgorithm} points={points} pairClick={pairClick}></PairRun>}
    </>
  )
}

export default App
