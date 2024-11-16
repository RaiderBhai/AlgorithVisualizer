import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

const Pair = ({ algorithm,setAlgorithm,points, pairClick }) => {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    const fetchTestCases = async () => {
      const files = ['pT1.txt', 'pT2.txt', 'pT3.txt', 'pT4.txt', 'pT5.txt','pT6.txt','pT7.txt','pT8.txt','pT9.txt','pT10.txt'];
      const loadedCases = [];

      for (const file of files) {
        const response = await fetch(`/tests/${file}`); // Adjust path if needed
        const text = await response.text();
        try {
          const points = JSON.parse(text.trim()); // Parse the array of points
          loadedCases.push(points);
        } catch (e) {
          console.error(`Error parsing file ${file}:`, e);
        }
      }

      setTestCases(loadedCases);
    };

    fetchTestCases();
  }, []);

  return (
    <div className="main-land-div">
      <div className="Back">
        <FaArrowLeft className="arrow-left" onClick={() => setAlgorithm("Landing")} />
      </div>
      <div className="welc-vis">
        <h1>Test Cases</h1>
        <h3>Select any one test case to begin visualization.</h3>
      </div>
      <div className="center-div">
        {testCases.map((testCase, index) => (
          <div
            key={index}
            className="test-case-box pair-box"
            onClick={() => pairClick(testCase)}
          >
            Test Case {index + 1} <br />
            #Points: {testCase.length}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pair;
