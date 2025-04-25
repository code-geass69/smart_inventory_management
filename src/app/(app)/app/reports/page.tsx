"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function AppReportsPage(): JSX.Element {
  const [predictions, setPredictions] = useState<any>(null);
  const [graphType, setGraphType] = useState<"monthly" | "weekly" | "daily">("monthly");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
    return (
      <div className="p-8 min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <p className="text-lg animate-pulse">🔄 Loading live reports...</p>
      </div>
    );
  }

  const graphData = predictions.salesForecast.map((value: number, i: number) => ({
    month: monthNames[(i + 6) % 12],
    units: value,
  }));

  const demandData = predictions.itemDemandPrediction.map((item: any) => ({
    name: item.name,
    demand: Number(item.predictedDemand || item.predicteddemand),
  }));

  return (
    <div className="p-8 text-white min-h-screen bg-[#0B0F19] space-y-12">
      <h1 className="text-3xl font-semibold">📊 App Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#1f2937] p-6 rounded-lg shadow hover:shadow-blue-500/20">
          <h2 className="text-xl font-semibold mb-4">📈 Sales Forecast</h2>
          <ul className="space-y-3">
            {graphData.map((item: { month: string; units: number }, i: number) => (
              <li key={i} className="flex justify-between">
                <span className="text-lg">{item.month}</span>
                <span className="text-lg font-bold">{item.units.toFixed(0)} units</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-lg shadow hover:shadow-blue-500/20">
          <h2 className="text-xl font-semibold mb-4">📦 Top Demanded Items</h2>
          <ul className="space-y-3">
            {demandData.map((item: { name: string; demand: number }, i: number) => (
              <li key={i} className="flex justify-between">
                <span className="text-lg">{item.name}</span>
                <span className="text-lg font-bold">{item.demand} units</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-lg shadow hover:shadow-blue-500/20">
          <h2 className="text-xl font-semibold mb-4">🙍‍♂️ Churn Rate Prediction</h2>
          <p className="text-lg font-bold">{predictions.churnRate}%</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-lg shadow hover:shadow-blue-500/20">
          <h2 className="text-xl font-semibold mb-4">💰 Revenue Prediction</h2>
          <p className="text-lg font-bold">₹{Number(predictions.revenuePrediction).toLocaleString()}</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-lg shadow hover:shadow-blue-500/20">
          <h2 className="text-xl font-semibold mb-4">🚚 Inventory Shortage</h2>
          <p className="text-lg font-bold">
            {predictions.inventoryShortage ? "⚠️ Shortage Expected" : "✅ No Shortage Detected"}
          </p>
        </div>
      </div>

      <hr className="border-gray-700" />

      <div>
        <div className="flex gap-4 mb-6">
          {["monthly", "weekly", "daily"].map((type) => (
            <button
              key={type}
              onClick={() => setGraphType(type as any)}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                graphType === type ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {graphType === "monthly" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-[#1f2937] p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">📊 Monthly Sales (Bar)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={graphData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#1f2937] p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">📉 Monthly Sales (Line)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={graphData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="units" stroke="#22D3EE" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#1f2937] p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">📦 Demand (Bar)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demandData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#1f2937] p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">📦 Demand (Line)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={demandData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="demand" stroke="#FACC15" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">⏳ Data for "{graphType}" is coming soon.</div>
        )}
      </div>

      <hr className="border-gray-700" />

      <div className="bg-[#1f2937] p-6 rounded-lg text-white">
        <h2 className="text-xl font-semibold mb-4">📋 Forecast Table</h2>
        <table className="w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="text-left bg-gray-800">
              <th className="p-2">Month</th>
              <th className="p-2">Sales Forecast (units)</th>
            </tr>
          </thead>
          <tbody>
            {graphData.map((entry: { month: string; units: number }, i: number) => (
              <tr key={i} className="border-t border-gray-700">
                <td className="p-2">{entry.month}</td>
                <td className="p-2">{entry.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
