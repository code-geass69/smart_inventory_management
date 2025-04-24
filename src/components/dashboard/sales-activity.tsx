"use client"
import { useState, useEffect } from "react";
import { SalesActivityItem } from "./sales-activity-item"; // Import the SalesActivityItem component

export function SalesActivity(): JSX.Element {
  const [salesData, setSalesData] = useState<any>({
    toBePacked: 0,
    toBeShipped: 0,
    toBeDelivered: 0,
    toBeInvoiced: 0,
  });

  // Fetch sales activity data from the backend
  useEffect(() => {
    const fetchSalesData = async () => {
      const res = await fetch("/api/dashboard/sales-activity"); // Your backend endpoint
      const data = await res.json();

      if (data.status === "success") {
        setSalesData(data.data); // Set sales data in state
      } else {
        console.error("Error fetching sales data");
      }
    };

    fetchSalesData();
  }, []);

  // Dynamically update the dashboard items based on fetched data
  const dashboardSalesActivityItems = [
    {
      quantity: salesData.toBePacked,
      unit: "Qty",
      label: "Orders Pending",
    },
    {
      quantity: salesData.toBeInvoiced,
      unit: "Qty",
      label: "Orders Accepted",
    },
    {
      quantity: salesData.toBeShipped,
      unit: "Pkgs",
      label: "Orders Shipped",
    },
    {
      quantity: salesData.toBeDelivered,
      unit: "Pkgs",
      label: "Orders Delivered",
    },
  ];

  return (
    <div className="flex h-auto w-full flex-col whitespace-nowrap rounded-md border bg-tertiary transition-all duration-300 ease-in-out hover:bg-secondary/30 xl:h-48 xl:w-2/3">
      <div className="flex h-16 items-center bg-secondary/20 px-5">
        <h3 className="font-semibold capitalize tracking-wide">Sales Activity</h3>
      </div>
      <div className="grid h-full grid-cols-2 border-t lg:grid-cols-4">
        {dashboardSalesActivityItems.map((activityItem) => (
          <SalesActivityItem
            key={activityItem.label}
            quantity={activityItem.quantity}
            unit={activityItem.unit}
            label={activityItem.label}
          />
        ))}
      </div>
    </div>
  );
}
