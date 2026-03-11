import { NextResponse } from "next/server";
import { mockProducts } from "@/src/service/customer/mockProducts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 12);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const data = mockProducts.slice(start, end);

  return NextResponse.json({
    data,
    total: mockProducts.length,
    page,
    pageSize,
  });
}