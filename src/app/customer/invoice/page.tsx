"use client"

import { useEffect, useRef, useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileTextIcon, EyeOpenIcon, CalendarIcon, CheckCircledIcon, IdCardIcon } from "@radix-ui/react-icons"
import { Skeleton } from "@/components/ui/skeleton"
import InvoiceDownload from "./invoice-download"

export default function InvoicePage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const downloadRef = useRef<HTMLDivElement>(null)
  const [pendingDownload, setPendingDownload] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      const email = localStorage.getItem("customerEmail")
      const res = await fetch(`/api/customers/invoice?email=${email}`)
      const data = await res.json()
      if (data.status === "success") {
        setOrders(data.data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const downloadInvoice = async () => {
    if (!downloadRef.current || !selectedOrder) return
    const canvas = await html2canvas(downloadRef.current)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF()
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0)
    pdf.save(`invoice-${selectedOrder.id}.pdf`)
  }

  useEffect(() => {
    if (open && pendingDownload && selectedOrder) {
      setTimeout(() => {
        downloadInvoice()
        setPendingDownload(false)
      }, 300)
    }
  }, [open, pendingDownload, selectedOrder])

  return (
    <div className="p-6 bg-[#0d0f15] min-h-screen text-white">
      <h2 className="text-3xl font-semibold mb-8 text-center">Your Orders</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl bg-[#1a1d24]" />
          ))
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-gray-700 rounded-xl p-5 shadow-lg bg-[#1a1d24]">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-gray-300"><IdCardIcon /> <strong>Order ID:</strong> #{order.id}</p>
                <p className="flex items-center gap-2 text-gray-300"><CheckCircledIcon /> <strong>Status:</strong> {order.orderStatus}</p>
                <p className="flex items-center gap-2 text-gray-300"><CalendarIcon /> <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                {order.items?.[0] && (
                  <>
                    <p className="text-white text-sm">Item: {order.items[0].itemName}</p>
                    <p className="text-white text-sm">Quantity: {order.items[0].quantity}</p>
                    <p className="text-white font-semibold text-lg">Price: ₹{order.items[0].price}</p>
                  </>
                )}
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => { setSelectedOrder(order); setOpen(true) }} className="text-white border-white hover:bg-white hover:text-black">
                  <EyeOpenIcon className="mr-2" /> Preview
                </Button>
                <Button
                  onClick={() => {
                    setSelectedOrder(order)
                    setPendingDownload(true)
                    setOpen(true)
                  }}
                >
                  <FileTextIcon className="mr-2" /> Download
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-[#1a1d24] text-white">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {selectedOrder && (
              <InvoiceDownload ref={downloadRef} order={selectedOrder} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {selectedOrder && <InvoiceDownload ref={downloadRef} order={selectedOrder} />}
      </div>
    </div>
  )
}