const Landing = ({algorithm,setAlgorithm})=>{
    return (
        <>
            <div className="main-land-div">
                <div className="welc-text">
                    <h1>Welcome to code visualizer</h1>
                    <h3>Select an Algorithm to run.</h3>
                </div>
                <div className="sel-buttons">
                    <button type="button" className="btn btn-success" onClick={()=>setAlgorithm("Integer")}>Integer Multiplication</button>
                    <button type="button" className="btn btn-success" onClick={()=>setAlgorithm("Pair")}>Closest Pair</button>
                </div>
            </div>
        </>
    )
}

export default Landing;