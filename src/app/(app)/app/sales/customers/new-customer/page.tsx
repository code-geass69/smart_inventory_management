import { redirect } from "next/navigation"
import { auth } from "@/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubSubHeader } from "@/components/nav/subsubheader"
import { AddCustomerForm } from "@/components/forms/sales/customers/add-customer-form"

export default async function AppSalesCustomersNewPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  return (
    <div className="relative">
      <SubSubHeader />

      <div className="p-5">
        <Card className="max-w-5xl rounded-md bg-tertiary">
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-2xl">New Customer</CardTitle>
            <CardDescription className="text-base">
              Add New Customer
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pt-2">
            <AddCustomerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
