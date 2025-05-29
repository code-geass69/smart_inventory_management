export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAllCategories } from "@/actions/inventory/categories";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json(categories ?? []);
}
