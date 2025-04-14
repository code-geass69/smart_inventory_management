import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { CustomersSubheader } from "@/components/sales/subheaders/customers-subheader"
import { CustomerOptionCards } from "@/components/sales/customer-option-cards"

export default async function AppSalesCustomersPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  return (
    <div>
      <CustomersSubheader />
      <CustomerOptionCards />
    </div>
  )
}
