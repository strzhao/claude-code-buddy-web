import { NextResponse } from "next/server";

import { CACHE_MAX_AGE } from "@/lib/constants";
import { listSkinsByStatus } from "@/lib/kv";
import type { RemoteSkinEntry, SkinRecord } from "@/lib/types";

function toRemoteSkinEntry(record: SkinRecord): RemoteSkinEntry {
  return {
    id: record.id,
    name: record.name,
    author: record.author,
    version: record.version,
    preview_url: record.preview_blob_url,
    download_url: record.blob_url,
    size: record.size,
  };
}

export async function GET() {
  // 1. Get all approved skins
  const approved = await listSkinsByStatus("approved");

  // 2. Deduplicate by id (keep latest version per id, comparing created_at)
  const latestById = new Map<string, SkinRecord>();
  for (const record of approved) {
    const existing = latestById.get(record.id);
    if (
      !existing ||
      new Date(record.created_at).getTime() >
        new Date(existing.created_at).getTime()
    ) {
      latestById.set(record.id, record);
    }
  }

  // 3. Map to RemoteSkinEntry[]
  const entries: RemoteSkinEntry[] = Array.from(latestById.values()).map(
    toRemoteSkinEntry,
  );

  // 4. Set Cache-Control headers and return flat JSON array
  return NextResponse.json(entries, {
    headers: {
      "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE * 2}`,
    },
  });
}
