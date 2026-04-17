import { NextResponse } from "next/server";

import { getSkinRecord, moveSkinStatus } from "@/lib/kv";
import { errorResponse } from "@/lib/errors";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ck = decodeURIComponent(id);

  const record = await getSkinRecord(ck);
  if (!record) {
    return errorResponse(404, "Skin not found");
  }

  if (record.status !== "pending") {
    return errorResponse(
      400,
      "Invalid status transition",
      `Skin is already "${record.status}", can only reject pending skins`,
    );
  }

  const body = await request.json();
  const reason: string = body?.reason ?? "";

  const updated = await moveSkinStatus(ck, "pending", "rejected", {
    rejection_reason: reason,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json(updated);
}
