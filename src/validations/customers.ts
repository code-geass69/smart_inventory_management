import * as z from "zod";

// SCHEMA: Create or Update a Customer
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone_number: z.string().min(10, "Phone number is too short"),
  address: z.string().optional(),
});

// For Updating: Add ID to the base schema
export const updateCustomerSchema = customerSchema.extend({
  id: z.number(),
});

// For Deleting: ID only
export const deleteCustomerSchema = z.object({
  id: z.number(),
});

// Exporting inferred types
export type AddCustomerFormInput = z.infer<typeof customerSchema>;
export type UpdateCustomerFormInput = z.infer<typeof updateCustomerSchema>;
export type DeleteCustomerFormInput = z.infer<typeof deleteCustomerSchema>;
