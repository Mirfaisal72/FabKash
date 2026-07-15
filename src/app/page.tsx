import Image from "next/image";
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
          <Image
            src={brand.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero__photo"
            style={{ objectPosition: brand.heroImagePosition }}
          />
          <div className="hero__veil" />
          <div className="hero__glow" />
        </div>
        <div className="hero__content">
          <p className="hero__brand">{brand.name}</p>
          <h1 className="hero__headline">{brand.tagline}</h1>
          <p className="hero__support">
            Hand-finished wraps in wool and pashmina blends — soft drape, fine
            weave, and the quiet elegance of Kashmir craft.
          </p>
          <div className="hero__actions">
            <Link href="/shop" className="btn btn--teal btn--hero">
              Shop the collection
            </Link>
            <a
              className="btn btn--ghost-light"
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="section section--mood">
        <div className="page-shell mood-strip">
          <p className="eyebrow">Feel</p>
          <h2>Soft enough to keep close. Strong enough to be remembered.</h2>
          <p className="muted mood-strip__copy">
            Every piece is chosen for drape, touch, and quiet presence — the kind
            of wrap that turns an ordinary evening warm.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div className="section__head">
            <p className="eyebrow">Featured wraps</p>
            <h2>Ready to fall into</h2>
            <p className="muted">
              A short edit of current favourites — soft textures, rich colour,
              ready to ship.
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
