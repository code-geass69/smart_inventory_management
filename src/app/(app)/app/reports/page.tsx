// src/app/reports/page.tsx

"use client"; // Ensure this is a client-side component

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default function AppReportsPage(): JSX.Element {
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("/api/predictions");
        const data = await res.json();
        setPredictions(data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    fetchPredictions();
  }, []);

  if (!predictions) {
    return <div className="p-5">Loading predictions...</div>;
  }

  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">App Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Forecast Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sales Forecast</h2>
          <ul className="space-y-4">
            {predictions.salesForecast.map((forecast: number, index: number) => (
              <li key={index} className="flex justify-between">
                <span className="text-lg">Month {index + 7}</span>
                <span className="text-lg font-bold">
                  {forecast.toFixed(2)} units
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Item Demand Prediction Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Item Demand Prediction</h2>
          <ul className="space-y-4">
            {predictions.itemDemandPrediction.map((item: any, index: number) => (
              <li key={index} className="flex justify-between">
                <span className="text-lg">{item.name}</span>
                <span className="text-lg font-bold">
                  {item.predictedDemand} units
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Churn Prediction Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Customer Churn Prediction</h2>
          <p className="text-lg font-bold">{predictions.churnRate}%</p>
        </div>

        {/* Revenue Prediction Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Revenue Prediction</h2>
          <p className="text-lg font-bold">
            ${predictions.revenuePrediction.toFixed(2)}
          </p>
        </div>

        {/* Inventory Shortage Prediction Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Inventory Shortage Prediction</h2>
          <p className="text-lg font-bold">
            {predictions.inventoryShortage ? "Warning: Shortage Expected" : "No Shortage Predicted"}
          </p>
        </div>
      </div>
    </div>
  );
}
