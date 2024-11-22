import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LinearScale, PointElement, CategoryScale, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement, CategoryScale, LineElement);

const PairRun = ({ points }) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [finalResult, setFinalResult] = useState({ closestPair: null, minDist: null });

  useEffect(() => {
    const visualizeClosestPair = () => {
      const steps = [];

      const distance = (p1, p2) =>
        Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);

      const closestPairRecursive = (pointsSortedByX, pointsSortedByY) => {
        steps.push({ type: "split", points: pointsSortedByX });

        if (pointsSortedByX.length <= 3) {
          let minDist = Infinity;
          let closestPair = null;

          for (let i = 0; i < pointsSortedByX.length; i++) {
            for (let j = i + 1; j < pointsSortedByX.length; j++) {
              const d = distance(pointsSortedByX[i], pointsSortedByX[j]);
              if (d < minDist) {
                minDist = d;
                closestPair = [pointsSortedByX[i], pointsSortedByX[j]];
              }
            }
          }

          steps.push({
            type: "base",
            points: pointsSortedByX,
            closestPair,
            minDist,
          });
          return { closestPair, minDist };
        }

        const mid = Math.floor(pointsSortedByX.length / 2);
        const leftPoints = pointsSortedByX.slice(0, mid);
        const rightPoints = pointsSortedByX.slice(mid);

        const midX = pointsSortedByX[mid][0];
        const leftClosest = closestPairRecursive(leftPoints, pointsSortedByY);
        const rightClosest = closestPairRecursive(rightPoints, pointsSortedByY);

        let minDist = Math.min(leftClosest.minDist, rightClosest.minDist);
        let closestPair =
          leftClosest.minDist < rightClosest.minDist
            ? leftClosest.closestPair
            : rightClosest.closestPair;

        const strip = pointsSortedByY.filter(
          (point) => Math.abs(point[0] - midX) < minDist
        );

        for (let i = 0; i < strip.length; i++) {
          for (let j = i + 1; j < strip.length && strip[j][1] - strip[i][1] < minDist; j++) {
            const d = distance(strip[i], strip[j]);
            if (d < minDist) {
              minDist = d;
              closestPair = [strip[i], strip[j]];
            }
          }
        }

        steps.push({
          type: "combine",
          strip,
          midX,
          closestPair,
          minDist,
        });

        return { closestPair, minDist };
      };

      const pointsSortedByX = [...points].sort((a, b) => a[0] - b[0]);
      const pointsSortedByY = [...points].sort((a, b) => a[1] - b[1]);
      const result = closestPairRecursive(pointsSortedByX, pointsSortedByY);

      setSteps(steps);
      setFinalResult(result);
    };

    visualizeClosestPair();
  }, [points]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const skipToFinalStep = () => {
    setCurrentStep(steps.length - 1);
  };

  const renderChartData = () => {
    const pointsData = steps[currentStep]?.points || points;
    const splitX = steps[currentStep]?.midX || 5;

    const chartData = {
      datasets: [
        {
          label: "Closest Pair",
          data: steps[currentStep]?.closestPair
            ? steps[currentStep]?.closestPair.map(([x, y]) => ({ x, y }))
            : [],
          backgroundColor: "red",
          radius: 6,
        },
        {
          label: "Points",
          data: pointsData.map(([x, y]) => ({ x, y })),
          backgroundColor: "blue",
          radius: 3,
        },
        {
          label: "Split Line",
          data: [
            { x: splitX, y: 0 },
            { x: splitX, y: 10 },
          ],
          borderColor: "black",
          borderWidth: 2,
          fill: false,
          type: "line",
        },
      ],
    };

    return chartData;
  };

  return (
    <div className="visualization">
      <h2>Closest Pair Visualization</h2>
      {steps.length > 0 ? (
        <div>
          <Scatter data={renderChartData()} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          <div className="controls">
            <button onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </button>
            <button onClick={nextStep} disabled={currentStep === steps.length - 1}>
              Next
            </button>
            <button onClick={skipToFinalStep} disabled={currentStep === steps.length - 1}>
              Skip to Final Step
            </button>
          </div>
          {currentStep === steps.length - 1 && finalResult.closestPair && (
            <div className="result">
              <h3>Final Result</h3>
              <p>Closest Pair: {JSON.stringify(finalResult.closestPair)}</p>
              <p>Distance: {finalResult.minDist.toFixed(2)}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PairRun;
