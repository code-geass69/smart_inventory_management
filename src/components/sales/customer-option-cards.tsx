import { customerOptions } from "@/data/constants/customers"
import { CustomerOptionCard } from "@/components/sales/customer-option-card"

export function CustomerOptionCards(): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
      {customerOptions.map((option) => (
        <CustomerOptionCard key={option.title} option={option} />
      ))}
    </div>
  )
}
