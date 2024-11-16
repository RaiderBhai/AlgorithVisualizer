import React, { useState } from "react";
import { FaHome } from "react-icons/fa";

// Recursive Karatsuba function with steps tracking
const karatsuba = (x, y, depth = 0) => {
  const len = Math.max(x.toString().length, y.toString().length);

  // Base case
  if (len === 1) return { result: x * y, steps: [{ depth, description: `Base case: ${x} * ${y} = ${x * y}` }] };

  const m = Math.floor(len / 2);
  const [a, b] = splitNumber(x, m);
  const [c, d] = splitNumber(y, m);

  const z2 = karatsuba(a, c, depth + 1);
  const z0 = karatsuba(b, d, depth + 1);
  const z1 = karatsuba(a + b, c + d, depth + 1);

  const result = z2.result * 10 ** (2 * m) + (z1.result - z2.result - z0.result) * 10 ** m + z0.result;

  // Track each step and formula used at this level
  const steps = [
    { depth, description: `Split: ${x} -> A=${a}, B=${b} | ${y} -> C=${c}, D=${d}` },
    ...z2.steps,
    ...z0.steps,
    ...z1.steps,
    {
      depth,
      description: `Combine: (${z2.result} * 10^${2 * m}) + (${z1.result} - ${z2.result} - ${z0.result}) * 10^${m} + ${z0.result} = ${result}`,
    },
  ];

  return { result, steps };
};

const splitNumber = (num, m) => {
  const strNum = num.toString().padStart(m * 2, "0");
  const left = parseInt(strNum.slice(0, -m), 10);
  const right = parseInt(strNum.slice(-m), 10);
  return [left, right];
};

// IntegerRun component for visualization
const IntegerRun = ({ algorithm,setAlgorithm,mul }) => {
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleRun = () => {
    const [x, y] = mul;
    const { result, steps } = karatsuba(x, y);
    setResult(result);
    setSteps(steps);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="visualizer">
      <FaHome className="home" onClick={()=>setAlgorithm("Landing")}/>
      <h1>Karatsuba Multiplication Visualization </h1>
      <h2>Multiplying: {mul[0]} x {mul[1]}</h2>
      <button onClick={handleRun}>Start Visualization</button>
      
      {steps.length > 0 && (
        <div>
          <h3>Result (Final): {result}</h3>
          <button onClick={handleNextStep} disabled={currentStep >= steps.length - 1}>Next Step</button>
          <div className="step">
            <h4>Step {currentStep + 1} of {steps.length}</h4>
            <p>{steps[currentStep].description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegerRun;
