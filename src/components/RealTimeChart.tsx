import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js"
import styles from "./RealTimeChart.module.css"  // Import CSS Module

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const RealTimeChart = ({ data, labels }: { data: number[]; labels: string[] }) => {
  const [chartData, setChartData] = useState({
    labels: labels,
    datasets: [
      {
        label: "Inventory Quantity",
        data: data,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  })

  useEffect(() => {
    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Inventory Quantity",
          data: data,
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
        },
      ],
    })
  }, [data, labels])

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Inventory Quantity (Real-Time)</h3>
      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  )
}

export default RealTimeChart
