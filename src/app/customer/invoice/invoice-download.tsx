import React, { forwardRef } from "react";
import { BoxIcon, CalendarIcon, CheckCircledIcon, FileTextIcon, HomeIcon, IdCardIcon } from "@radix-ui/react-icons";

const InvoiceDownload = forwardRef(({ order }: { order: any }, ref: React.Ref<HTMLDivElement>) => {
  if (!order) return null;

  return (
    <div ref={ref} className="p-6 text-sm w-full text-black bg-white">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h3 className="text-xl font-bold">Zaiko</h3>
        <span className="text-sm text-gray-600 flex items-center gap-1">
          <CalendarIcon /> {new Date(order.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <p className="flex items-center gap-2"><IdCardIcon /> <strong>Order ID:</strong> #{order.id}</p>
        <p className="flex items-center gap-2"><IdCardIcon /> <strong>Customer ID:</strong> {order.customerId}</p>
        <p className="flex items-center gap-2"><HomeIcon /> <strong>Shipping:</strong> {order.shippingAddress || "N/A"}</p>
        <p className="flex items-center gap-2"><CheckCircledIcon /> <strong>Status:</strong> {order.orderStatus}</p>
        <p className="flex items-center gap-2"><FileTextIcon /> <strong>Total:</strong> ₹{order.totalPrice}</p>
      </div>

      <h4 className="font-semibold mb-2">Items</h4>
      {order.items && order.items.length > 0 ? (
        <table className="w-full text-left border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Item</th>
              <th className="p-2">Description</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, idx: number) => (
              <tr key={idx} className="border-t border-gray-300">
                <td className="p-2 flex items-center gap-2"><BoxIcon /> {item.itemName}</td>
                <td className="p-2">{item.description || "-"}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No item details available</p>
      )}
    </div>
  );
});

InvoiceDownload.displayName = "InvoiceDownload";
export default InvoiceDownload;
