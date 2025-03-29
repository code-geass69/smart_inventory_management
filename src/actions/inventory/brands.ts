"use server"

import { db } from "@/db"
import { brands } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { z } from "zod"
import {
  type brandSchema,
  deleteBrandSchema,
  type DeleteBrandFormInput,
} from "@/validations/inventory"

export async function addBrand(input: z.infer<typeof brandSchema>) {
  try {
    await db.insert(brands).values({
      name: input.name,
      category: input.category,
    })
    return "success"
  } catch (error) {
    console.error("Error adding brand:", error)
    return "error"
  }
}

export async function deleteBrand(
  rawInput: DeleteBrandFormInput
): Promise<"invalid-input" | "success" | "error"> {
  const validatedInput = deleteBrandSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  try {
    const deletedBrand = await db
      .delete(brands)
      .where(eq(brands.id, validatedInput.data.id))

    return deletedBrand ? "success" : "error"
  } catch (error) {
    console.error("Error deleting brand:", error)
    return "error"
  }
}
