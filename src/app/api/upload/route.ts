import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { compositeKey, skinExists, setSkinRecordNX } from "@/lib/kv";
import { uploadSkinZip, uploadPreviewImage } from "@/lib/storage";
import { validateSkinZip, extractPreviewImage } from "@/lib/validation";
import { MAX_UPLOAD_SIZE } from "@/lib/constants";
import { errorResponse } from "@/lib/errors";
import type { SkinRecord, UploadResponse } from "@/lib/types";

// Add route segment config for longer timeout
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Parse formData — get "file" (File/Blob) and optional "author" (string)
  const formData = await request.formData();
  const file = formData.get("file");
  const authorOverride = formData.get("author");

  // 2. Check file exists
  if (!file || !(file instanceof File)) {
    return errorResponse(400, "No file provided");
  }

  // 3. Check file size
  if (file.size > MAX_UPLOAD_SIZE) {
    return errorResponse(
      413,
      "File too large",
      `Max ${MAX_UPLOAD_SIZE} bytes`
    );
  }

  // 4. Read file to ArrayBuffer
  const buffer = await file.arrayBuffer();

  // 5. Validate the zip
  const validationResult = await validateSkinZip(buffer);
  if (!validationResult.valid) {
    return errorResponse(
      400,
      "Validation failed",
      validationResult.errors.join("; ")
    );
  }

  // 6. Get manifest from validation result
  const manifest = validationResult.manifest!;

  // Allow author override from form field
  if (typeof authorOverride === "string" && authorOverride.trim() !== "") {
    manifest.author = authorOverride.trim();
  }

  // 7. Check for duplicate
  const ck = compositeKey(manifest.id, manifest.version);
  const exists = await skinExists(ck);
  if (exists) {
    return errorResponse(
      409,
      "Skin already exists",
      `${manifest.id}:${manifest.version}`
    );
  }

  // 8. Upload zip to Blob
  const blob_url = await uploadSkinZip(
    manifest.id,
    manifest.version,
    Buffer.from(buffer)
  );

  // 9. Extract and upload preview image if present
  let preview_blob_url: string | null = null;
  if (manifest.preview_image) {
    const previewBuffer = await extractPreviewImage(buffer, manifest);
    if (previewBuffer) {
      preview_blob_url = await uploadPreviewImage(
        manifest.id,
        manifest.version,
        previewBuffer
      );
    }
  }

  // 10. Create SkinRecord with status "pending"
  const now = new Date().toISOString();
  const record: SkinRecord = {
    id: manifest.id,
    name: manifest.name,
    author: manifest.author,
    version: manifest.version,
    status: "pending",
    manifest,
    blob_url,
    preview_blob_url,
    size: file.size,
    created_at: now,
    updated_at: now,
  };

  // 11. setSkinRecordNX — guard against race condition
  const created = await setSkinRecordNX(record);
  if (!created) {
    return errorResponse(
      409,
      "Skin already exists",
      `${manifest.id}:${manifest.version}`
    );
  }

  // 12. Return success
  const uploadResponse: UploadResponse = {
    success: true,
    skin: {
      id: record.id,
      name: record.name,
      status: record.status,
    },
  };

  return NextResponse.json(uploadResponse, { status: 201 });
}
