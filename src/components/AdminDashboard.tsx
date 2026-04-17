"use client";

import { useState, useCallback, useEffect } from "react";
import type { SkinRecord, SkinStatus } from "@/lib/types";
import StatusBadge from "./StatusBadge";

type TabValue = SkinStatus | "all";

const TABS: { label: string; value: TabValue }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

function compositeKey(id: string, version: string) {
  return `${id}:${version}`;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabValue>("pending");
  const [skins, setSkins] = useState<SkinRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchSkins = useCallback(async (status: TabValue) => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/skins?status=${status}`);
      if (!res.ok) {
        const body = await res.json();
        setActionError(body.error ?? "Failed to load skins.");
        setSkins([]);
      } else {
        const data = (await res.json()) as SkinRecord[];
        setSkins(data);
      }
    } catch {
      setActionError("Network error loading skins.");
      setSkins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkins(activeTab);
  }, [activeTab, fetchSkins]);

  function switchTab(tab: TabValue) {
    setActiveTab(tab);
    setSkins([]);
  }

  async function handleApprove(skin: SkinRecord) {
    const ck = encodeURIComponent(compositeKey(skin.id, skin.version));
    const res = await fetch(`/api/admin/skins/${ck}/approve`, {
      method: "POST",
    });
    if (!res.ok) {
      const body = await res.json();
      setActionError(body.error ?? "Approve failed.");
      return;
    }
    fetchSkins(activeTab);
  }

  async function handleReject(skin: SkinRecord) {
    const reason = window.prompt(
      `Rejection reason for "${skin.name}" (optional):`,
      ""
    );
    if (reason === null) return; // cancelled
    const ck = encodeURIComponent(compositeKey(skin.id, skin.version));
    const res = await fetch(`/api/admin/skins/${ck}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const body = await res.json();
      setActionError(body.error ?? "Reject failed.");
      return;
    }
    fetchSkins(activeTab);
  }

  async function handleDelete(skin: SkinRecord) {
    if (
      !window.confirm(
        `Delete "${skin.name}" v${skin.version} permanently? This cannot be undone.`
      )
    ) {
      return;
    }
    const ck = encodeURIComponent(compositeKey(skin.id, skin.version));
    const res = await fetch(`/api/admin/skins/${ck}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json();
      setActionError(body.error ?? "Delete failed.");
      return;
    }
    fetchSkins(activeTab);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Review and manage submitted skin packs.
        </p>

        {/* Tab bar */}
        <div className="mb-6 flex gap-0 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => switchTab(tab.value)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action error */}
        {actionError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
            <button
              onClick={() => setActionError(null)}
              className="ml-3 underline hover:no-underline"
            >
              dismiss
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner />
            Loading…
          </div>
        )}

        {/* Empty state */}
        {!loading && skins.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-gray-400">
            No {activeTab === "all" ? "" : activeTab} skins found.
          </div>
        )}

        {/* Skin cards */}
        {!loading && skins.length > 0 && (
          <div className="space-y-4">
            {skins.map((skin) => (
              <SkinCard
                key={compositeKey(skin.id, skin.version)}
                skin={skin}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SkinCardProps {
  skin: SkinRecord;
  onApprove: (skin: SkinRecord) => void;
  onReject: (skin: SkinRecord) => void;
  onDelete: (skin: SkinRecord) => void;
}

function SkinCard({ skin, onApprove, onReject, onDelete }: SkinCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex gap-4 p-4">
        {/* Preview image */}
        {skin.preview_blob_url && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={skin.preview_blob_url}
              alt={`${skin.name} preview`}
              className="h-20 w-20 rounded-md border border-gray-200 object-contain bg-gray-50"
            />
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{skin.name}</span>
            <StatusBadge status={skin.status} />
            <span className="text-xs text-gray-400">v{skin.version}</span>
          </div>
          <div className="text-sm text-gray-600 mb-1">
            by <span className="font-medium">{skin.author}</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>
              Canvas:{" "}
              <span className="font-mono">
                {skin.manifest.canvas_size[0]}x{skin.manifest.canvas_size[1]}
              </span>
            </span>
            <span>
              Animations:{" "}
              <span className="font-mono">
                {skin.manifest.animation_names.length}
              </span>
            </span>
            <span>
              ID: <span className="font-mono">{skin.id}</span>
            </span>
            <span>
              Size:{" "}
              <span className="font-mono">
                {(skin.size / 1024).toFixed(1)} KB
              </span>
            </span>
            <span>
              Submitted:{" "}
              {new Date(skin.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {skin.rejection_reason && (
            <p className="mt-1 text-xs text-red-600">
              Reason: {skin.rejection_reason}
            </p>
          )}
        </div>
      </div>

      {/* Manifest viewer */}
      <div className="border-t border-gray-100 px-4 pb-3 pt-2">
        <details className="group">
          <summary className="cursor-pointer select-none text-xs text-gray-400 hover:text-gray-600 group-open:mb-2">
            View manifest JSON
          </summary>
          <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-gray-700 border border-gray-200 max-h-60">
            {JSON.stringify(skin.manifest, null, 2)}
          </pre>
        </details>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
        {skin.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(skin)}
              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(skin)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(skin)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-gray-400"
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
