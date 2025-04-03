// src/app/inventory/statistics/page.tsx

"use client"

import React, { useEffect, useState } from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js"
import RealTimeChart from "@/components/RealTimeChart"
import styles from "@/components/RealTimeChart.module.css" // Import the styles

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

const InventoryStatisticsPage = () => {
  const [categoryData, setCategoryData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  })

  useEffect(() => {
    const fetchCategoryData = async () => {
      const response = await fetch("/api/inventory")
      const data = await response.json()

      const labels = data.map((item: any) => item.categoryName)
      const values = data.map((item: any) => item.itemCount)

      setCategoryData({
        labels: labels,
        values: values,
      })
    }

    fetchCategoryData()
  }, [])

  const chartData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733", "#2ECC71", "#9B59B6"],
        hoverBackgroundColor: ["#FF5B77", "#50A8D4", "#FFDB70", "#FF7C59", "#38D26B", "#A06FD5"],
      },
    ],
  }

  return (
    <div className={styles.statisticsPageContainer}>
      <div>
        <h3>Items by Category</h3>
        <Pie data={chartData} />
      </div>

      {/* Real-time Chart */}
      <div>
        <RealTimeChart data={[10, 20, 30]} labels={["Item 1", "Item 2", "Item 3"]} />
      </div>

      {/* Add more charts in this grid as needed */}
    </div>
  )
}

export default InventoryStatisticsPage
