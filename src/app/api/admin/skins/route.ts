import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { listSkinsByStatus } from "@/lib/kv";
import type { SkinStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const statusParam = searchParams.get("status") ?? "pending";

  const validStatuses = ["pending", "approved", "rejected", "all"];
  if (!validStatuses.includes(statusParam)) {
    return NextResponse.json(
      { error: "Invalid status parameter" },
      { status: 400 },
    );
  }

  const records = await listSkinsByStatus(statusParam as SkinStatus | "all");

  return NextResponse.json(records);
}
