import Link from "next/link";
import SkinCard from "./SkinCard";
import type { SkinRecord } from "@/lib/types";

async function getApprovedSkins(): Promise<SkinRecord[]> {
  try {
    const { listSkinsByStatus } = await import("@/lib/kv");
    return await listSkinsByStatus("approved");
  } catch {
    return [];
  }
}

export default async function SkinsSection() {
  const skins = await getApprovedSkins();

  return (
    <section id="skins" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="pixel-heading text-3xl text-ink mb-10 text-center">
          皮肤商店
        </h2>

        {skins.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skins.map((skin) => (
              <SkinCard key={`${skin.id}:${skin.version}`} skin={skin} />
            ))}
            <Link
              href="/upload"
              className="bg-surface-alt rounded pixel-border border-dashed border-border-strong p-4 flex flex-col items-center justify-center text-center hover:border-primary transition-colors min-h-[160px]"
            >
              <span className="text-2xl mb-2">+</span>
              <span className="text-secondary text-sm">上传你的皮肤包 →</span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-3xl mb-4">🎨</p>
            <p className="text-muted">皮肤商店即将上线，敬请期待</p>
            <Link
              href="/upload"
              className="inline-block mt-4 text-primary hover:text-primary-hover font-mono text-sm transition-colors"
            >
              成为第一个上传皮肤的创作者 →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
