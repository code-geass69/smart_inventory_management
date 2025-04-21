"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PlaceOrderPage() {
  const [items, setItems] = useState<any[]>([]); // Store available items
  const [selectedItem, setSelectedItem] = useState<any>(null); // Store selected item
  const [quantity, setQuantity] = useState(1); // Store quantity
  const [orderDetails, setOrderDetails] = useState<any>({
    category: "",
    brand: "",
    warehouse: "",
    cp: 0,
    sp: 0,
  });

  // Initialize state for customerId and shippingAddress
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<string>("");

  // Fetch customer details based on email stored in LocalStorage
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const email = localStorage.getItem("customerEmail");

      if (email) {
        const res = await fetch(`/api/customers/getCustomerDetails?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (data.status === "success") {
          setCustomerId(data.customerId);
          setShippingAddress(data.shippingAddress); // Set the shipping address from the response
        } else {
          console.error("Failed to fetch customer details");
        }
      }
    };

    fetchCustomerDetails();
  }, []);

  // Fetch available items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/items/fetch");
      const data = await res.json();

      if (data.status === "success") {
        setItems(data.data);
      } else {
        console.error("Error fetching items");
      }
    };

    fetchItems();
  }, []);

  const handleItemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = items.find((item) => item.itemId === Number(e.target.value)); // Use correct property name (itemId)

    setSelectedItem(selected);

    // Update the order details with category, brand, and warehouse info based on the selected item
    if (selected) {
      setOrderDetails({
        category: selected.categoryName || "",
        brand: selected.brandName || "",
        warehouse: selected.warehouseLocation || "",
        cp: selected.purchasePrice,
        sp: selected.sellingPrice,
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const calculateTotalPrice = () => {
    return orderDetails.sp * quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      alert("Please select an item before submitting the order.");
      return;
    }
    const orderData = {
      itemId: selectedItem.itemId,  // Use itemId from API response
      quantity,
      totalPrice: calculateTotalPrice(),
      customerId: localStorage.getItem("customerId"), // Correctly retrieve customerId from localStorage
      shippingAddress,
    }

    const res = await fetch("/api/customers/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (data.status === "success") {
      alert("Order placed successfully!");
      // Redirect to view orders page after placing the order
      window.location.href = "/customer/view-orders";
    } else {
      alert("Order placement failed.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="item">Select Item</Label>
          <select
            id="item"
            name="item"
            onChange={handleItemSelect}
            className="w-full p-2"
          >
            <option value="">Select an Item</option>
            {items.map((item) => (
              <option key={item.itemId} value={item.itemId}>
                {item.itemName} {/* Correct field name */}
              </option>
            ))}
          </select>
        </div>

        {selectedItem && (
          <>
            <div>
              <Label>Category</Label>
              <Input value={orderDetails.category} readOnly />
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={orderDetails.brand} readOnly />
            </div>
            <div>
              <Label>Warehouse</Label>
              <Input value={orderDetails.warehouse} readOnly />
            </div>
            <div>
              <Label>Cost Price (CP)</Label>
              <Input value={orderDetails.cp} readOnly />
            </div>
            <div>
              <Label>Selling Price (SP)</Label>
              <Input value={orderDetails.sp} readOnly />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-full p-2"
              />
            </div>
            <div>
              <Label>Total Price</Label>
              <Input value={`₹${calculateTotalPrice()}`} readOnly />
            </div>
          </>
        )}

        <Button type="submit">Place Order</Button>
      </form>
    </div>
  );
}
