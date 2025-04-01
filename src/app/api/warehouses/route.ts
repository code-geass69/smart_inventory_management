// src/app/api/warehouses/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { warehouses } from "@/db/schema";

export async function GET() {
  try {
    const warehouseData = await db.select().from(warehouses);
    return NextResponse.json(warehouseData);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return NextResponse.error();
  }
}
