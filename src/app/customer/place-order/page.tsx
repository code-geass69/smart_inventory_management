"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast"

export default function PlaceOrderPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null); 
  const [quantity, setQuantity] = useState(1); 
  const [orderDetails, setOrderDetails] = useState<any>({
    category: "",
    brand: "",
    warehouse: "",
    cp: 0,
    sp: 0,
  });
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>(""); 
  const [showStockModal, setShowStockModal] = useState(false);
  const [maxAllowedQty, setMaxAllowedQty] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const email = localStorage.getItem("customerEmail");

      if (email) {
        const res = await fetch(`/api/customers/getCustomerDetails?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (data.status === "success") {
          setCustomerId(data.customerId);
          setShippingAddress(data.shippingAddress);
        } else {
          console.error("Failed to fetch customer details");
        }
      }
    };

    fetchCustomerDetails();
  }, []);

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
    const selected = items.find((item) => item.itemId === Number(e.target.value)); 

    setSelectedItem(selected);

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
    const enteredQty = Number(e.target.value);
    if (selectedItem && enteredQty > selectedItem.quantity) {
      setMaxAllowedQty(selectedItem.quantity);
      setShowStockModal(true);
      setQuantity(selectedItem.quantity); // restrict it
    } else {
      setQuantity(enteredQty);
    }
  };
  

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  const calculateTotalPrice = () => {
    return orderDetails.sp * quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      toast({
        title: "Missing Item",
        description: "Please select an item before submitting the order.",
        variant: "destructive",
      })
      return
    }


    const orderData = {
      itemId: selectedItem.itemId, 
      quantity,
      totalPrice: calculateTotalPrice(),
      customerId: localStorage.getItem("customerId"),
      shippingAddress,
      paymentStatus: paymentMethod,
    };

    const res = await fetch("/api/customers/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (data.status === "success") {
      toast({
      title: "Order Placed",
      description: "Your order has been placed successfully!",
    })
    setTimeout(() => {
      window.location.href = "/customer/view-orders"
    }, 1000)

    } else {
      toast({
      title: "Order Failed",
      description: data.message || "Something went wrong.",
      variant: "destructive",
    })
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <Label htmlFor="item">Select Item</Label>
          <Select onValueChange={(val) => handleItemSelect({ target: { value: val } } as any)}>
            <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black">
              <SelectValue placeholder="Select an Item" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {items.map((item) => (
                <SelectItem key={item.itemId} value={item.itemId.toString()}>
                  {item.itemName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        {/* Payment Method Dropdown */}
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            onChange={handlePaymentMethodChange}
            value={paymentMethod}
            className="w-full p-2"
          >
            <option value="">Select Payment Method</option>
            <option value="partially paid">Partially Paid</option>
            <option value="fully paid">Fully Paid</option>
            <option value="cash on delivery">Cash on Delivery</option>
          </select>
        </div>

        <Button type="submit">Place Order</Button>
      </form>
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black rounded-md p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-3">⚠️ Stock Limit Exceeded</h3>
            <p className="mb-4">
              Only <span className="font-bold">{maxAllowedQty}</span> units available right now. Stock will be renewed soon.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowStockModal(false)}
              >
                Okay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
