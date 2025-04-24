"use client";
import { useState, useEffect } from "react";

export function TopSellingItems(): JSX.Element {
  const [topSellingItems, setTopSellingItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopSellingItems = async () => {
      const res = await fetch("/api/dashboard/top-selling-items");
      const data = await res.json();

      if (data.status === "success") {
        const sortedItems = data.data.sort((a: any, b: any) => b[2] - a[2]);
        const top5Items = sortedItems.slice(0, 5); 

        setTopSellingItems(top5Items); 
      } else {
        setTopSellingItems([]);
      }
    };

    fetchTopSellingItems();
  }, []);

  return (
    <div className="flex h-64 w-full flex-col whitespace-nowrap rounded-md border bg-tertiary transition-all duration-300 ease-in-out hover:bg-secondary/30 xl:w-1/2">
      <div className="flex h-16 items-center justify-between bg-secondary/20 px-5">
        <h3 className="shrink-0 font-semibold capitalize tracking-wide">
          Top Selling Items
        </h3>
      </div>
      <div className="flex h-full flex-col items-center justify-center border-t">
        {topSellingItems.length > 0 ? (
          topSellingItems.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center w-full py-2 px-5 border-b">
              <p className="flex-1">{item[1]}</p> 
              <p className="flex-1 text-center">{item[2]} pcs</p> 
              <p className="flex-1 text-right">${item[3]}</p> 
            </div>
          ))
        ) : (
          <p className="text-sm tracking-wide text-muted-foreground">
            No items were invoiced
          </p>
        )}
      </div>
    </div>
  );
}


