import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LinearScale, PointElement, CategoryScale, LineElement } from 'chart.js';

// Register the components manually
ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement, CategoryScale, LineElement);

const PairRun = ({ points }) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const visualizeClosestPair = () => {
      const steps = [];
      
      // Helper function to calculate distance between two points
      const distance = (p1, p2) =>
        Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);

      // Recursive function to find the closest pair
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

        // Split the points
        const mid = Math.floor(pointsSortedByX.length / 2);
        const leftPoints = pointsSortedByX.slice(0, mid);
        const rightPoints = pointsSortedByX.slice(mid);

        const midX = pointsSortedByX[mid][0];
        const leftClosest = closestPairRecursive(leftPoints, pointsSortedByY);
        const rightClosest = closestPairRecursive(rightPoints, pointsSortedByY);

        // Combine step
        let minDist = Math.min(leftClosest.minDist, rightClosest.minDist);
        let closestPair =
          leftClosest.minDist < rightClosest.minDist
            ? leftClosest.closestPair
            : rightClosest.closestPair;

        // Check the strip
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

      // Preprocess and start
      const pointsSortedByX = [...points].sort((a, b) => a[0] - b[0]);
      const pointsSortedByY = [...points].sort((a, b) => a[1] - b[1]);
      closestPairRecursive(pointsSortedByX, pointsSortedByY);

      setSteps(steps);
    };

    visualizeClosestPair();
  }, [points]);

  // Move to the next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // Skip directly to the final step
  const skipToFinalStep = () => {
    setCurrentStep(steps.length - 1);
  };

  // Prepare data for the chart
  const renderChartData = () => {
    const pointsData = steps[currentStep]?.points || points;
    const splitX = steps[currentStep]?.midX || 5; // Split point from the current step

    const chartData = {
      datasets: [
        {
          label: "Closest Pair", // Closest pair rendered first to be on top
          data: steps[currentStep]?.closestPair
            ? steps[currentStep]?.closestPair.map(([x, y]) => ({ x, y }))
            : [],
          backgroundColor: "red", // Closest pair in red
          radius: 6, // Increase size of closest pair points
        },
        {
          label: "Points",
          data: pointsData.map(([x, y]) => ({ x, y })),
          backgroundColor: "blue",
          radius: 3, // Smaller regular points
        },
        {
          label: "Split Line",
          data: [
            { x: splitX, y: 0 },
            { x: splitX, y: 10 }, // Adjust y-values to match the graph's scale
          ],
          borderColor: "black",
          borderWidth: 2,
          fill: false,
          type: "line", // Render as a line
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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PairRun;
