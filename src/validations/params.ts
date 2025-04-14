import * as z from "Zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default("createdAt.desc"),
})

export const inventorySearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  warehouseId: z.string().optional(),
  brandId: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  supplier: z.string().optional(),
})

export const categoriesSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  description: z.string().optional(),
})

export const warehousesSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
})

export const brandsSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  category: z.string().optional(),
})

export const customerSearchParamsSchema = searchParamsSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
})