import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl" aria-hidden>
              🐱
            </span>
            <h1 className="text-2xl font-semibold text-gray-900">
              Claude Code Buddy
            </h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Skin Store — upload, review, and distribute custom sprite packs for
            the Claude Code Buddy macOS app.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <Link
            href="/upload"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 group"
          >
            <div>
              <p className="font-medium text-gray-900 group-hover:text-blue-700">
                Upload Skin Pack
              </p>
              <p className="text-sm text-gray-500">
                Submit a .zip file for review
              </p>
            </div>
            <span className="text-gray-300 group-hover:text-blue-400 text-lg">
              →
            </span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50 group"
          >
            <div>
              <p className="font-medium text-gray-900">Admin Dashboard</p>
              <p className="text-sm text-gray-500">
                Approve, reject, or delete submissions
              </p>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 text-lg">
              →
            </span>
          </Link>

          <a
            href="/api/skins"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50 group"
          >
            <div>
              <p className="font-medium text-gray-900">Public Catalog API</p>
              <p className="text-sm text-gray-500">
                <code className="font-mono text-xs">GET /api/skins</code> —
                approved skins JSON feed
              </p>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 text-lg">
              ↗
            </span>
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Skin packs must pass validation before appearing in the store.
        </p>
      </div>
    </main>
  );
}
