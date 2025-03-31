"use server"

import { db } from "@/db"
import { brands } from "@/db/schema"
import { categories } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { z } from "zod"
import {
  type brandSchema,
  deleteBrandSchema,
  type DeleteBrandFormInput,
} from "@/validations/inventory"

export async function addBrand(input: z.infer<typeof brandSchema>) {
  try {
    const categoryResult = await db
        .select({ id: categories.id })
        .from(categories)             
        .where(eq(categories.name, input.category))
        .limit(1)

    if (categoryResult.length === 0) {
      throw new Error("Category not found");
    }

    const categoryId = categoryResult[0]?.id
      if (!categoryId) {
        throw new Error("Category ID not found")
      }

      await db.insert(brands).values({
        name: input.name,
        category: input.category,
        categoryId: categoryId,
      });

    return "success";
  } catch (error) {
    console.error("Error adding brand:", error);
    return "error";
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
