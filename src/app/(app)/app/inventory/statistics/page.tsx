"use client"

import React, { useEffect, useState } from "react"
import { Pie, Bar } from "react-chartjs-2"
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Filler } from "chart.js"
import styles from "@/components/RealTimeChart.module.css"
import { Radar, Doughnut } from "react-chartjs-2"

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, RadialLinearScale, Filler, ArcElement, BarElement)

const InventoryStatisticsPage = () => {

  const [categoryData, setCategoryData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  })

  const [warehouseData, setWarehouseData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  })

  const [profitLossData, setProfitLossData] = useState<{ labels: string[]; values: number[]; colors: string[] }>({
    labels: [],
    values: [],
    colors: [],
  })

  const [stockData, setStockData] = useState<{ labels: string[]; quantity: number[]; reorder: number[] }>({
    labels: [],
    quantity: [],
    reorder: [],
  })

  const [valueData, setValueData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  })

  const [summaryStats, setSummaryStats] = useState<{totalItems: number,totalCategories: number,totalBrands: number,totalWarehouses: number,lowStockItems: number} | null>(null)

  useEffect(() => {

    const fetchCategoryData = async () => {
      const response = await fetch("/api/inventory")
      const data = await response.json()
      setCategoryData({
        labels: data.map((item: any) => item.categoryName),
        values: data.map((item: any) => item.itemCount),
      })
    }

    const fetchWarehouseData = async () => {
      const response = await fetch("/api/inventory/warehouse-item-count")
      const data = await response.json()
      setWarehouseData({
        labels: data.map((item: any) => item.warehouseName),
        values: data.map((item: any) => item.itemCount),
      })
    }

    const fetchProfitLossData = async () => {
      const response = await fetch("/api/inventory/item-profit-loss")
      const data = await response.json()
      setProfitLossData({
        labels: data.map((item: any) => item.name),
        values: data.map((item: any) => item.profit),
        colors: data.map((item: any) => (item.profit >= 0 ? "rgba(46, 204, 113, 0.7)" : "rgba(231, 76, 60, 0.7)")), 
      })
    }

    const fetchStockData = async () => {
      const response = await fetch("/api/inventory/quantity-reorder")
      const data = await response.json()
      setStockData({
        labels: data.map((item: any) => item.name),
        quantity: data.map((item: any) => item.quantity),
        reorder: data.map((item: any) => item.reorderPoint),
      })
    }

    const fetchValueData = async () => {
      const response = await fetch("/api/inventory/total-value")
      const data = await response.json()
      setValueData({
        labels: data.map((item: any) => item.name),
        values: data.map((item: any) => item.value),
      })
    }

    const fetchSummaryStats = async () => {
      const res = await fetch("/api/inventory/summary")
      const data = await res.json()
      setSummaryStats(data)
    }

    fetchSummaryStats()
    fetchValueData()
    fetchStockData()
    fetchCategoryData()
    fetchWarehouseData()
    fetchProfitLossData()
  }, [])


  const categoryChart = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.values,
        backgroundColor: ["#1ABC9C","#3498DB","#F1C40F","#E67E22","#9B59B6","#2ECC71","#95A5A6","#34495E","#D35400","#7F8C8D"],
        hoverBackgroundColor: ["#16A085","#2980B9","#F39C12","#D35400","#8E44AD","#27AE60","#7F8C8D","#2C3E50","#BA4A00","#616A6B"],
      },
    ],
  }

  const warehouseChart = {
    labels: warehouseData.labels,
    datasets: [
      {
        label: "Items per Warehouse",
        data: warehouseData.values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  }
  
  return (
    <div className={styles.statisticsPageContainer}>
      {/*Summary statistics card */}
      <div className={styles.summaryTableCard}>
        <div className={styles.cardHeader}>
          <span>📦 Inventory Summary</span>
        </div>
        <div className={styles.statRow}><span>🧾 Items</span><span>{summaryStats?.totalItems}</span></div>
        <div className={styles.statRow}><span>🧪 Categories</span><span>{summaryStats?.totalCategories}</span></div>
        <div className={styles.statRow}><span>🏷 Brands</span><span>{summaryStats?.totalBrands}</span></div>
        <div className={styles.statRow}><span>🏬 Warehouses</span><span>{summaryStats?.totalWarehouses}</span></div>
        <div className={styles.statRow}><span>⚠️ Low Stock</span><span style={{ color: "#f39c12" }}>{summaryStats?.lowStockItems}</span></div>
      </div>

      {/*Items by Category */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>📊 Items by Category</h3>
        <div className={styles.pieChartWrapper}>
          <Pie data={categoryChart}/>
        </div>
      </div>

      {/*Items by Warehouse */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>🏬 Items by Warehouse</h3>
        <Bar
          data={warehouseChart}
          options={{responsive: true, maintainAspectRatio: false, layout: {padding: {top: 0, bottom: 20,}},
            scales: {y: {beginAtZero: true,ticks: {stepSize: 5, color: "#ccc",
                  font: {weight: "bold", size: 11, },},
                  title: {display: true, text: "Number of Items", color: "#fff", font: { weight: "bold", size: 14 },},
                  grid: {color: "#000000",},},
                  x: {ticks: {color: "#fff",
                  font: {weight: "bold",size: 11,},
                  autoSkip: false,
                  maxRotation: 0,
                  minRotation: 0,
                },
                  grid: {color: "#000000",},},},
            plugins: {legend: {labels: {color: "#ccc",font: {size: 12, weight: "bold"},},},},}}
        />
      </div>

      {/*Profit or Loss per Item (Horizontal Bar) */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>💸 Profit / Loss per Item</h3>
        <Bar data={{labels: profitLossData.labels, datasets: [{label: "Profit / Loss", data: profitLossData.values, backgroundColor: profitLossData.colors,}],}}
          options={{indexAxis: "y", responsive: true, maintainAspectRatio: false, layout: {padding: {top: 0, bottom: 20,}},
            scales: {
              x: {beginAtZero: true, title: { display: true, text: "Profit / Loss (₹)", color: "#fff" ,font: { weight: "bold"}}, ticks: { color: "#ccc" }, grid: { color: "#000"}},
              y: { grid: { color: "#000"}, ticks: { color: "#fff", font: { weight: "bold"},}},},
            plugins: {legend: { labels: { color: "#fff" }, },
            tooltip: {callbacks: {label: (ctx) => {const val = ctx.raw as number; return `${val >= 0 ? "Profit" : "Loss"}: ₹${Math.abs(val).toLocaleString()}`;},},},},}}
        />
      </div>

      {/* 📡 Quantity vs Reorder Point Radar Chart */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>📡 Quantity vs Reorder Point</h3>
        <Radar data={{labels: stockData.labels, datasets: [
              {
                label: "Quantity",
                data: stockData.quantity,
                backgroundColor: "rgba(54, 162, 235, 0.3)",
                borderColor: "rgba(54, 162, 235, 1)",
                pointBackgroundColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              },
              {
                label: "Reorder Point",
                data: stockData.reorder,
                backgroundColor: "rgba(255, 99, 132, 0.3)",
                borderColor: "rgba(255, 99, 132, 1)",
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
            ],
          }}
          options={{responsive: true, maintainAspectRatio: false, layout: {padding: {top: 0, bottom: 20,}}, scales: {r: {beginAtZero: true, angleLines: { color: "#444" }, grid: { color: "#000" }, pointLabels: { color: "#fff" }, ticks: { color: "#000" },},},plugins: {legend: { labels: { color: "#fff" } },},}}
        />
      </div>

      {/*   Total Inventory Value per Item */}
      <div className={styles.chartContainer}>
         <h3 className={styles.chartTitle}>💰 Total Inventory Value per Item</h3>
        <div className={styles.doughnutWrapper}>
        <Doughnut data={{labels: valueData.labels, datasets: [
              {data: valueData.values, backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#66bb6a", "#ef5350", "#ab47bc", "#ffa726"], hoverOffset: 10,},],}}
          options={{responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#fff" },},
              tooltip: {callbacks: {label: (ctx) => {const val = ctx.raw as number;return `₹${val.toLocaleString()}`;},},},},}}
        />
      </div>
    </div>
  </div>
  )
}

export default InventoryStatisticsPage
