"use server"

import { db } from "@/db"
import { customers } from "@/db/schema"
import { parse } from "csv-parse/sync"
import { z } from "zod"
import type { InferInsertModel } from "drizzle-orm";

const CsvCustomerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  address: z.string(),
  password: z.string(),  
  state: z.string(),
})

export async function importCustomersFromCsv(fileBuffer: string): Promise<string> {
  try {
    const records = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`Parsed ${records.length} customers from CSV`)

    for (const rawCustomer of records) {
      const parsed = CsvCustomerSchema.safeParse(rawCustomer)

      if (!parsed.success) {
        console.error("Validation error for customer:", rawCustomer)
        console.error(parsed.error)
        throw new Error("Invalid customer CSV format")
      }

      const input = parsed.data 

      const customerToInsert: InferInsertModel<typeof customers> = {
        name: input.name,
        email: input.email,
        phone_number: input.phone_number,
        address: input.address,
        password: input.password,  
        state: input.state,            
      };
      await db.insert(customers).values(customerToInsert);
      console.log(`✅ Customer "${input.name}" inserted`)
    }

    return "success"
  } catch (error) {
    console.error("❌ Error importing customers:", error)
    return "error"
  }
}
