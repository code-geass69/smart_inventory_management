"use client"
import { useState, useEffect } from "react";

export function InventorySummary(): JSX.Element {
  const [inventoryData, setInventoryData] = useState<any>({
    quantityInHand: 0,
    quantityToBeSent: 0,
  });

  useEffect(() => {
    const fetchInventoryData = async () => {
      const res = await fetch("/api/dashboard/inventory-summary"); 
      const data = await res.json();

      if (data.status === "success") {
        setInventoryData(data.data); 
      }
    };

    fetchInventoryData();
  }, []);

  return (
    <div className="flex h-48 w-full flex-col whitespace-nowrap rounded-md border bg-tertiary transition-all duration-300 ease-in-out hover:bg-secondary/30 xl:w-1/3">
      <div className="flex h-16 items-center bg-secondary/20 px-5">
        <h3 className="font-semibold capitalize tracking-wide">
          Inventory Summary
        </h3>
      </div>
      <div className="flex h-full flex-col justify-center border-t px-5">
        <div className="flex items-center justify-between border-b py-4">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Quantity in Hand
          </p>
          <p className="px-1 text-xl font-semibold">{inventoryData.quantityInHand}</p>
        </div>
        <div className="flex items-center justify-between py-4">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Quantity to be Sent
          </p>
          <p className="px-1 text-xl font-semibold">{inventoryData.quantityToBeSent}</p>
        </div>
      </div>
    </div>
  );
}
