import { Sidebar } from "@/components/nav/customer/sidebar"
import { CustomerHeader } from "@/components/nav/customer/header"
import "@/styles/globals.css"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-[#0B0F19] text-white">
      <Sidebar />

      {/* Divider */}
      <div className="w-[1px] bg-gray-700" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <CustomerHeader />
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  )
}
