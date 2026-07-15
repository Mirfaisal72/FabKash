import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { brand } from "@/lib/brand";
import { isSanityConfigured } from "@/sanity/env";
import { getFeaturedProducts } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!isSanityConfigured()) {
    return (
      <div className="page-shell section">
        <p className="eyebrow">Setup</p>
        <h1>Connect Sanity to see your catalog</h1>
        <p className="muted">
          Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> to your <code>.env</code> file,
          then run <code>npm run seed:sanity</code>. See README for full steps.
        </p>
      </div>
    );
  }

  const featured = await getFeaturedProducts();

  return (
    <>
      <section className="hero">
        <div className="hero__media" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1601924999981-b98e1e8e2c88?w=1800&q=80"
            alt=""
          />
          <div className="hero__veil" />
        </div>
        <div className="hero__content">
          <p className="hero__brand">{brand.name}</p>
          <h1 className="hero__headline">{brand.tagline}</h1>
          <p className="hero__support">
            Wool, pashmina blends, and embroidered wraps — curated for daily wear
            and thoughtful gifting.
          </p>
          <div className="hero__actions">
            <Link href="/shop" className="btn btn--teal">
              Shop shawls
            </Link>
            <a
              className="btn btn--ghost"
              style={{ color: "#f4f8fa", borderColor: "rgba(244,248,250,0.35)" }}
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div className="section__head">
            <p className="eyebrow">Featured wraps</p>
            <h2>Pieces ready to ship</h2>
            <p className="muted">
              Edit products anytime in{" "}
              <Link href="/studio">Sanity Studio</Link> — no code needed.
            </p>
          </div>
          {featured.length === 0 ? (
            <p className="muted">
              No featured shawls yet. Open <Link href="/studio">/studio</Link> and
              add products.
            </p>
          ) : (
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div style={{ marginTop: "2rem" }}>
            <Link href="/shop" className="btn btn--primary">
              View full shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
