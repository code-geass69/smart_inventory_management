"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Package,
  Tag,
  Building,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Truck,
} from "lucide-react";

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
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const email = localStorage.getItem("customerEmail");
      if (email) {
        const res = await fetch(`/api/customers/getCustomerDetails?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.status === "success") {
          setCustomerId(data.customerId);
          setShippingAddress(data.shippingAddress);
        }
      }
    };
    fetchCustomerDetails();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      const res = await fetch("/api/items/fetch");
      const data = await res.json();
      if (data.status === "success") {
        setItems(data.data);
      }
      setLoadingItems(false);
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
      setQuantity(selectedItem.quantity);
    } else {
      setQuantity(enteredQty);
    }
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  const calculateTotalPrice = () => orderDetails.sp * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      toast({ title: "Missing Item", description: "Please select an item before submitting.", variant: "destructive" });
      return;
    }
    if (!paymentMethod) {
      toast({ title: "Missing Payment Method", description: "Please select a payment method.", variant: "destructive" });
      return;
    }
    setShowSummaryModal(true);
  };

  const handleConfirmOrder = async () => {
    const orderData = {
      itemId: selectedItem.itemId,
      quantity,
      totalPrice: calculateTotalPrice(),
      customerId,
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
      toast({ title: "Order Placed", description: "Your order has been placed successfully!" });
      setTimeout(() => window.location.href = "/customer/view-orders", 1000);
    } else {
      toast({ title: "Order Failed", description: data.message || "Something went wrong.", variant: "destructive" });
    }
    setShowSummaryModal(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F172A] overflow-hidden">
      <div className="bg-[#1E293B] text-white p-8 rounded-lg shadow-lg w-full max-w-5xl space-y-6">
        <h2 className="text-3xl font-bold mb-2">Place Your Order</h2>
        <p className="text-sm text-gray-400">Please select the item and payment method to proceed.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="item" className="text-white">
              <Package size={16} className="inline mr-2" /> Select Item
            </Label>
            {loadingItems ? (
              <p className="text-sm text-gray-400 mt-1">Loading items...</p>
            ) : (
              <Select onValueChange={(val) => handleItemSelect({ target: { value: val } } as any)}>
                <SelectTrigger className="w-full border border-white bg-white text-black rounded px-3 py-2">
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
            )}
          </div>

          {selectedItem && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Tag, label: "Category", value: orderDetails.category },
                { icon: Tag, label: "Brand", value: orderDetails.brand },
                { icon: Building, label: "Warehouse", value: orderDetails.warehouse },
                { icon: DollarSign, label: "Cost Price", value: orderDetails.cp },
                { icon: DollarSign, label: "Selling Price", value: orderDetails.sp },
                { icon: ShoppingCart, label: "Quantity", value: quantity, isInput: true },
                { icon: DollarSign, label: "Total Price", value: `₹${calculateTotalPrice()}` },
              ].map(({ icon: Icon, label, value, isInput }, idx) => (
                <div key={idx}>
                  <Label className="text-white">
                    <Icon size={16} className="inline mr-2" />
                    {label}
                  </Label>
                  <Input
                    readOnly={!isInput}
                    value={value}
                    onChange={isInput ? handleQuantityChange : undefined}
                    className="border border-white"
                    type={isInput ? "number" : "text"}
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <Label htmlFor="paymentMethod" className="text-white">
              <CreditCard size={16} className="inline mr-2" /> Payment Method
            </Label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              onChange={handlePaymentMethodChange}
              value={paymentMethod}
              className="w-full p-2 text-black border border-white rounded"
            >
              <option value="">Select Payment Method</option>
              <option value="partially paid">Partially Paid</option>
              <option value="fully paid">Fully Paid</option>
              <option value="cash on delivery">Cash on Delivery</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={!selectedItem || !paymentMethod}>
            Place Order
          </Button>
        </form>

        {showStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black rounded-md p-6 max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-3">⚠️ Stock Limit Exceeded</h3>
              <p className="mb-4">
                Only <span className="font-bold">{maxAllowedQty}</span> units available right now.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowStockModal(false)}>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}

        {showSummaryModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-[#1E293B] text-white rounded-lg p-6 w-full max-w-lg shadow-lg space-y-4">
              <h2 className="text-xl font-semibold">Confirm Your Order</h2>
             <table className="text-sm w-full border-collapse border border-white">
                <tbody>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><Package size={16} className="inline mr-1" /> Item:</td>
                    <td className="px-4 py-2 w-1/2">{selectedItem?.itemName}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><Tag size={16} className="inline mr-1" /> Category:</td>
                    <td className="px-4 py-2 w-1/2">{orderDetails.category}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><Tag size={16} className="inline mr-1" /> Brand:</td>
                    <td className="px-4 py-2 w-1/2">{orderDetails.brand}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><Building size={16} className="inline mr-1" /> Warehouse:</td>
                    <td className="px-4 py-2 w-1/2">{orderDetails.warehouse}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><ShoppingCart size={16} className="inline mr-1" /> Quantity:</td>
                    <td className="px-4 py-2 w-1/2">{quantity}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><DollarSign size={16} className="inline mr-1" /> Total:</td>
                    <td className="px-4 py-2 w-1/2">₹{calculateTotalPrice()}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><Truck size={16} className="inline mr-1" /> Shipping Address:</td>
                    <td className="px-4 py-2 w-1/2">{shippingAddress}</td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="border-r border-white px-2 py-1 font-semibold"><CreditCard size={16} className="inline mr-1" /> Payment Method:</td>
                    <td className="px-4 py-2 w-1/2">{paymentMethod}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end gap-3">
               <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() => setShowSummaryModal(false)}
              >
                Edit
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleConfirmOrder}
              >
                Confirm
              </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
