"use client";
import { useState, useEffect } from "react";

export function PurchaseOrder(): JSX.Element {
  const [purchaseOrderData, setPurchaseOrderData] = useState<any>({
    totalQuantityOrdered: 0,
    totalCost: 0,
  });

  // Fetch purchase order data
  useEffect(() => {
    const fetchPurchaseOrderData = async () => {

      const res = await fetch("/api/dashboard/purchase-order");
      const data = await res.json();

      console.log("Purchase order data fetched: ", data);

      if (data.status === "success" && data.data.length > 0) {
        const result = data.data[0]; // Access the first item in the array

        // Update state
        const updatedData = {
          totalQuantityOrdered: parseInt(result.total_quantity_ordered, 10),
          totalCost: parseFloat(result.total_cost),
        };

        setPurchaseOrderData(updatedData); // Set state with updated values
      } else {
        console.log("Failed to fetch valid data.");
        setPurchaseOrderData({ totalQuantityOrdered: 0, totalCost: 0 });
      }
    };

    fetchPurchaseOrderData();
  }, []); // Fetch when the component mounts

  return (
    <div className="flex h-80 w-full flex-col whitespace-nowrap rounded-md border bg-tertiary transition-all duration-300 ease-in-out hover:bg-secondary/30 xl:w-1/3">
      <div className="flex h-16 items-center justify-between bg-secondary/20 px-5">
        <h3 className="shrink-0 font-semibold capitalize tracking-wide">
          Purchase Order
        </h3>
      </div>
      <div className="flex h-full flex-col justify-center border-t px-5">
        <div className="flex items-center justify-between border-b py-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Quantity Ordered
          </p>
          <p className="px-1 text-xl font-semibold">{purchaseOrderData.totalQuantityOrdered}</p>
        </div>
        <div className="flex items-center justify-between py-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Total Cost
          </p>
          <p className="px-1 text-xl font-semibold">
            <span className="mr-2 text-base text-muted-foreground">₹</span>
            {purchaseOrderData.totalCost && !isNaN(purchaseOrderData.totalCost)
              ? purchaseOrderData.totalCost.toFixed(2)
              : "0.00"} {/* Only call toFixed if it's a valid number */}
          </p>
        </div>
      </div>
    </div>
  );
}
