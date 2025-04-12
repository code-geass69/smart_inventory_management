// // src/app/api/items/import/route.ts
// import { NextResponse } from "next/server"
// import { db } from "@/db"
// import { items } from "@/db/schema"

// export async function POST(req: Request) {
//   try {
//     // Log the incoming request
//     console.log("📥 Request received to import items.")

//     // Parse the JSON body from the request
//     const { items: rawItems } = await req.json()
//     console.log(`🔍 Parsed ${rawItems.length} items from CSV.`)

//     // Validate and process each item from the CSV
//     const itemsToInsert = rawItems.map((item: any) => {
//       console.log(`🔎 Processing item: ${item.name}`)  // Log each item being processed
//       return {
//         name: item.name,
//         categoryId: parseInt(item.categoryId, 10),
//         brandId: parseInt(item.brandId, 10),
//         barcode: item.barcode,
//         description: item.description,
//         sellingPrice: parseFloat(item.sellingPrice) || 0,  // Fallback to 0 if parseFloat fails
//         purchasePrice: parseFloat(item.purchasePrice) || 0,  // Fallback to 0 if parseFloat fails
//         taxRate: parseFloat(item.taxRate) || 0,  // Fallback to 0 if parseFloat fails
//         width: parseFloat(item.width) || 0,  // Fallback to 0 if parseFloat fails
//         height: parseFloat(item.height) || 0,  // Fallback to 0 if parseFloat fails
//         depth: parseFloat(item.depth) || 0,  // Fallback to 0 if parseFloat fails
//         dimensionsUnit: item.dimensionsUnit,
//         weight: parseFloat(item.weight) || 0,  // Fallback to 0 if parseFloat fails
//         weightUnit: item.weightUnit,
//         warehouse: item.warehouse,
//         sku: item.sku,
//         quantity: parseInt(item.quantity, 10),
//         unit: item.unit,
//         reorderPoint: parseInt(item.reorderPoint, 10),
//         supplier: item.supplier,
//         notes: item.notes,
//       }
//     })

//     // Log the number of items being inserted into the database
//     console.log(`✅ Preparing to insert ${itemsToInsert.length} items into the database.`)

//     // Insert items into the database
//     await db.insert(items).values(itemsToInsert)
//     console.log(`📤 Successfully inserted ${itemsToInsert.length} items into the database.`)

//     // Respond with success
//     return NextResponse.json({ status: "success" })
//   } catch (error) {
//     // Log any error that occurs
//     console.error("❌ Error importing items:", error)
//     return NextResponse.json({ status: "error" })
//   }
// }
