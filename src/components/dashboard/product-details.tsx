"use client"
import { useState, useEffect } from "react";

// Define types for the brand sales data
interface BrandData {
  brand_name: string;
  total_quantity_sold: number;
}

export function ProductDetails(): JSX.Element {
  const [brandSales, setBrandSales] = useState<BrandData[]>([]);

  // Fetch brand sales data from API
  useEffect(() => {
    const fetchBrandSalesData = async () => {
      const res = await fetch("/api/dashboard/brands");  // Ensure the API endpoint is correct
      const data = await res.json();

      if (data.status === "success") {
        setBrandSales(data.data); // Update state with the brand sales data
      }
    };

    fetchBrandSalesData();
  }, []);

  return (
    <div className="flex h-64 w-full flex-col whitespace-nowrap rounded-md border bg-tertiary transition-all duration-300 ease-in-out hover:bg-secondary/30 xl:w-1/2">
      <div className="flex h-16 items-center space-y-0 bg-secondary/20 px-5">
        <h3 className="font-semibold capitalize tracking-wide">
          Brands Associated
        </h3>
      </div>
      <div className="flex h-full flex-col items-center justify-center border-t px-5">
        {brandSales.length === 0 ? (
          <p className="text-sm tracking-wide text-muted-foreground">
            No brands associated
          </p>
        ) : (
          brandSales.map((brand, index) => (
            <div key={index} className="flex items-center justify-between border-b py-4 w-full">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {brand.brand_name}
              </p>
              <p className="px-1 text-xl font-semibold">{brand.total_quantity_sold}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
