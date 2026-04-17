"use client";

import { useState, useRef } from "react";
import type { ApiError, UploadResponse } from "@/lib/types";

const MAX_CLIENT_SIZE = 5 * 1024 * 1024; // 5 MB — matches server constant

type UploadState =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "success"; skin: UploadResponse["skin"] }
  | { kind: "error"; messages: string[] };

export default function UploadForm() {
  const [state, setState] = useState<UploadState>({ kind: "idle" });
  const [author, setAuthor] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setState({ kind: "error", messages: ["Please select a .zip file."] });
      return;
    }

    // Client-side size guard
    if (file.size > MAX_CLIENT_SIZE) {
      setState({
        kind: "error",
        messages: [
          `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — max allowed is 5 MB.`,
        ],
      });
      return;
    }

    setState({ kind: "uploading" });

    try {
      const formData = new FormData();
      formData.set("file", file);
      if (author.trim()) {
        formData.set("author", author.trim());
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.status === 201) {
        const data = (await res.json()) as UploadResponse;
        setState({ kind: "success", skin: data.skin });
        // Reset form
        if (fileRef.current) fileRef.current.value = "";
        setAuthor("");
        return;
      }

      // Parse error
      const errBody = (await res.json()) as ApiError;
      const messages: string[] = [errBody.error];
      if (errBody.details) {
        messages.push(...errBody.details.split("; ").filter(Boolean));
      }
      setState({ kind: "error", messages });
    } catch {
      setState({
        kind: "error",
        messages: ["Network error — please check your connection and try again."],
      });
    }
  }

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-xl font-semibold text-gray-900">
        Upload Skin Pack
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Submit a{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">.zip</code>{" "}
        file containing your skin manifest and sprites. Max 5 MB. Your skin will
        be reviewed before appearing in the store.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File input */}
        <div>
          <label
            htmlFor="skin-file"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Skin pack file <span className="text-red-500">*</span>
          </label>
          <input
            id="skin-file"
            ref={fileRef}
            type="file"
            accept=".zip"
            required
            disabled={state.kind === "uploading"}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Author name{" "}
            <span className="text-gray-400">(overrides manifest value)</span>
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name or handle"
            maxLength={80}
            disabled={state.kind === "uploading"}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={state.kind === "uploading"}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.kind === "uploading" ? (
            <>
              <Spinner />
              Uploading…
            </>
          ) : (
            "Upload Skin Pack"
          )}
        </button>
      </form>

      {/* Success */}
      {state.kind === "success" && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Uploaded successfully!
          </p>
          <p className="mt-1 text-sm text-green-700">
            <span className="font-mono">{state.skin.name}</span> (
            <span className="font-mono">{state.skin.id}</span>) is now{" "}
            <span className="font-medium">pending review</span>.
          </p>
        </div>
      )}

      {/* Errors */}
      {state.kind === "error" && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="mb-1 text-sm font-medium text-red-800">Upload failed</p>
          <ul className="list-inside list-disc space-y-0.5">
            {state.messages.map((msg, i) => (
              <li key={i} className="text-sm text-red-700">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
