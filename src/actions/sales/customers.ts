"use server"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { customers, type Customer } from "@/db/schema"
import {
  customerSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
  type AddCustomerFormInput,
  type UpdateCustomerFormInput,
  type DeleteCustomerFormInput,
} from "@/validations/customers"
import { eq } from "drizzle-orm"

// Get all customers
export async function getAllCustomers(): Promise<Customer[] | null> {
  try {
    noStore()
    const result = await db.select().from(customers)
    return result || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all customers")
  }
}

// Add a new customer
export async function addCustomer(
  rawInput: AddCustomerFormInput
): Promise<"invalid-input" | "exists" | "success" | "error"> {
  const validatedInput = customerSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  try {
    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.email, validatedInput.data.email))

    if (existing.length > 0) return "exists"

    const newCustomer = await db
      .insert(customers)
      .values(validatedInput.data)
      .returning()

    return newCustomer ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

// Update customer
export async function updateCustomer(
  rawInput: UpdateCustomerFormInput
): Promise<"invalid-input" | "success" | "error"> {
  const validatedInput = updateCustomerSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  try {
    const updated = await db
      .update(customers)
      .set(validatedInput.data)
      .where(eq(customers.id, validatedInput.data.id))
      .returning()

    return updated.length ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

// Delete customer
export async function deleteCustomer(
  rawInput: DeleteCustomerFormInput
): Promise<"invalid-input" | "success" | "error"> {
  const validatedInput = deleteCustomerSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  try {
    await db.delete(customers).where(eq(customers.id, validatedInput.data.id))
    return "success"
  } catch (error) {
    console.error(error)
    return "error"
  }
}
