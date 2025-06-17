"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PackageCheck, CreditCard, MapPin, CalendarClock } from "lucide-react"

export default function ViewOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSpinner, setShowSpinner] = useState(true) 
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false)
    }, 2000)

    const fetchOrders = async () => {
      const customerId = localStorage.getItem("customerId")
      if (!customerId) {
        alert("Please log in to view your orders")
        router.push("/signin")
        return
      }
      const res = await fetch(`/api/customers/view?customerId=${customerId}`, {
        method: "GET",
      })

      const data = await res.json()

      if (data.status === "success") {
        setOrders(data.data)
      } else {
        alert(data.message || "Failed to fetch orders")
      }
      setLoading(false)
    }

    fetchOrders()

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="p-6 min-h-screen bg-[#0F172A] text-white overflow-hidden flex flex-col">
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>

      {showSpinner ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="border-4 border-white border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      ) : loading ? (
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          <p className="text-xl text-center font-semibold text-gray-300">
            🚀 You have not placed any orders yet.<br />Start shopping now and place your first order!
          </p>
          <Button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            onClick={() => router.push("/customer/place-order")}
          >
            Place Order
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-[#1E293B] text-white border border-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <PackageCheck size={20} />
                    <span>Order #{order.id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <PackageCheck size={16} />
                    <Label>Order Status:</Label>
                    <span>{order.orderStatus}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard size={16} />
                    <Label>Total Price:</Label>
                    <span>₹{order.totalPrice}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <Label>Shipping Address:</Label>
                    <span>{order.shippingAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarClock size={16} />
                    <Label>Created At:</Label>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              onClick={() => router.push("/customer/place-order")}
            >
              Place New Order
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
