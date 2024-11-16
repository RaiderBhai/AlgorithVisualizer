import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

const Integer = ({algorithm,setAlgorithm,mulClick})=>{

    const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    const fetchTestCases = async () => {
      const files = ['iT1.txt', 'iT2.txt', 'iT3.txt', 'iT4.txt', 'iT5.txt', 'iT6.txt', 'iT7.txt','iT8.txt','iT9.txt','iT10.txt'];
      const loadedCases = [];

      for (const file of files) {
        const response = await fetch(`/tests/${file}`);  // Adjusted path
        const text = await response.text();
        loadedCases.push(text.trim());  // Trim whitespace and add to cases
      }

      setTestCases(loadedCases);
    };

    fetchTestCases();
  }, []);

    return (
        <div className='main-land-div'>
            <div className="Back">
                <FaArrowLeft className="arrow-left" onClick={()=>setAlgorithm("Landing")}/>
            </div>
            <div className="welc-vis">
                <h1>Test Cases</h1>
                <h3>Select any one test case to begin visualization.</h3>
            </div>
            <div className="center-div">
                {testCases.map((testCase, index) => {
                    const [num1, num2] = testCase.split(" ");
                    return (
                        <div key={index} className="test-case-box" onClick={()=>mulClick(num1,num2)}>
                            Multiply {num1} x {num2}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Integer;