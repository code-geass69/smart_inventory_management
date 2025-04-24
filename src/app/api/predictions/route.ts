import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

// Simple Linear Regression Formula
const simpleLinearRegression = (x: number[], y: number[]): number[] => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, idx) => acc + xi * y[idx], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  const futureMonths = [7, 8, 9, 10];
  return futureMonths.map((month) => m * month + b);
};

// Simulated Item Demand Prediction (can be enhanced with actual data)
const itemDemandPrediction = () => [
  { name: "Item A", predictedDemand: 50 },
  { name: "Item B", predictedDemand: 30 },
  { name: "Item C", predictedDemand: 70 },
];

// Simulated Revenue Prediction
const revenuePrediction = () => 100000; // Example: Predict total revenue

// Simulated Inventory Shortage Prediction
const inventoryShortagePrediction = () => {
  // Simple logic: Predict shortage if total quantity is below a certain threshold
  const totalInventory = 500;
  return totalInventory < 1000; // Example logic
};

export async function GET(req: NextApiRequest) {
  try {
    const salesData = [100, 120, 130, 140, 150, 160];
    const months = [1, 2, 3, 4, 5, 6];

    const salesForecast = simpleLinearRegression(months, salesData);

    // Simulating other predictions
    const churnRate = 10;
    const demandPrediction = itemDemandPrediction();
    const revenue = revenuePrediction();
    const inventoryShortage = inventoryShortagePrediction();

    // Use NextResponse to send the response
    return NextResponse.json({
      salesForecast,
      churnRate,
      itemDemandPrediction: demandPrediction,
      revenuePrediction: revenue,
      inventoryShortage: inventoryShortage,
    });
  } catch (error) {
    console.error("Error in predictions API:", error);
    return NextResponse.json({ error: "Error generating predictions" }, { status: 500 });
  }
}