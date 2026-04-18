import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl" aria-hidden>
              🐱
            </span>
            <h1 className="text-2xl font-semibold text-ink pixel-heading">
              Claude Code Buddy
            </h1>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Skin Store — upload, review, and distribute custom sprite packs for
            the Claude Code Buddy macOS app.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <Link
            href="/upload"
            className="flex items-center justify-between rounded pixel-border pixel-shadow-sm pixel-btn-active bg-surface px-5 py-4 transition-colors hover:border-primary hover:bg-primary-mist group"
          >
            <div>
              <p className="font-medium text-ink group-hover:text-primary">
                Upload Skin Pack
              </p>
              <p className="text-sm text-muted">
                Submit a .zip file for review
              </p>
            </div>
            <span className="text-muted group-hover:text-primary-hover text-lg">
              →
            </span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-between rounded pixel-border pixel-shadow-sm pixel-btn-active bg-surface px-5 py-4 transition-colors hover:border-border-strong hover:bg-surface-alt group"
          >
            <div>
              <p className="font-medium text-ink">Admin Dashboard</p>
              <p className="text-sm text-muted">
                Approve, reject, or delete submissions
              </p>
            </div>
            <span className="text-muted group-hover:text-secondary text-lg">
              →
            </span>
          </Link>

          <a
            href="/api/skins"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded pixel-border pixel-shadow-sm pixel-btn-active bg-surface px-5 py-4 transition-colors hover:border-border-strong hover:bg-surface-alt group"
          >
            <div>
              <p className="font-medium text-ink">Public Catalog API</p>
              <p className="text-sm text-muted">
                <code className="font-mono text-xs">GET /api/skins</code> —
                approved skins JSON feed
              </p>
            </div>
            <span className="text-muted group-hover:text-secondary text-lg">
              ↗
            </span>
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Skin packs must pass validation before appearing in the store.
        </p>
      </div>
    </main>
  );
}
