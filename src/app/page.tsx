import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { brand } from "@/lib/brand";
import { isSanityConfigured } from "@/sanity/env";
import { getFeaturedProducts } from "@/sanity/queries";

export const dynamic = "force-dynamic";

const CRAFT = [
  {
    title: "Pure materials",
    copy: "Cashmere pashmina and fine merino, chosen for a weightless, warm drape.",
    icon: (
      <>
        <path d="M12 3c-3.9 0-7 3.1-7 7 0 4.5 4.2 8.4 7 11 2.8-2.6 7-6.5 7-11 0-3.9-3.1-7-7-7Z" />
        <path d="M8 10c1.4 1.2 6.6 1.2 8 0" />
        <path d="M12 3.2v17.5" />
      </>
    ),
  },
  {
    title: "Hand-embroidered",
    copy: "Sozni needlework worked by Kashmiri artisans — hundreds of hours per piece.",
    icon: (
      <>
        <path d="M4 20 20 4" />
        <path d="m15 5 4 4" />
        <circle cx="6.5" cy="17.5" r="2" />
        <path d="M9 15c2 0 3-1 3-3" />
      </>
    ),
  },
  {
    title: "Made to last",
    copy: "Natural fibres and honest finishing — a wrap you keep for a decade, not a season.",
    icon: (
      <>
        <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 3 0 7 1 7 1s-1 4-1 7a7 7 0 0 1-7 7Z" />
        <path d="M4 20c4-1 7-4 9-8" />
      </>
    ),
  },
];

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
      <HomeHero />

      <Marquee />

      <section className="section section--craft">
        <div className="page-shell">
          <Reveal className="section__head section__head--center">
            <p className="eyebrow">Why it feels different</p>
            <h2>Craft you can feel in the first fold</h2>
          </Reveal>
          <div className="craft-grid">
            {CRAFT.map((item, i) => (
              <Reveal className="craft-card" key={item.title} delay={i * 90}>
                <span className="craft-card__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </span>
                <h3>{item.title}</h3>
                <p className="muted">{item.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="page-shell">
          <Reveal className="section__head section__head--row">
            <div>
              <p className="eyebrow">Featured wraps</p>
              <h2>Ready to fall into</h2>
            </div>
            <p className="muted section__head-copy">
              A short edit of current favourites — soft textures, rich colour,
              ready to ship.
            </p>
          </Reveal>

          {featured.length === 0 ? (
            <p className="muted">
              No featured shawls yet. Open <Link href="/studio">/studio</Link> and
              add products.
            </p>
          ) : (
            <div className="product-grid">
              {featured.map((product, i) => (
                <Reveal key={product._id} delay={(i % 3) * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="section__foot">
            <Link href="/shop" className="btn btn--primary">
              View full shop
              <span className="btn__arrow" aria-hidden>
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section story">
        <div className="page-shell story__inner">
          <svg className="story__motif" viewBox="0 0 210 210" fill="none" aria-hidden focusable="false">
            <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M120 14 C74 14 34 52 34 104 C34 158 78 196 128 196 C170 196 200 166 200 126 C200 88 172 60 134 60 C104 60 82 82 82 110 C82 132 99 149 121 149 C137 149 149 138 149 123" strokeWidth="2.2" />
              <path d="M120 40 C86 40 58 70 58 110 C58 150 90 180 128 180 C158 180 180 158 180 130" strokeWidth="1.5" opacity="0.6" />
            </g>
          </svg>
          <Reveal className="story__text">
            <p className="eyebrow">Our thread</p>
            <blockquote className="story__quote">
              “Soft enough to keep close. Strong enough to be remembered.”
            </blockquote>
            <p className="muted">
              Every piece is chosen for drape, touch, and quiet presence — the kind
              of wrap that turns an ordinary evening warm. Made in small batches, so
              no two are ever quite the same.
            </p>
            <Link href="/about" className="link-arrow">
              Read our story <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <Reveal className="cta-band">
            <div className="cta-band__glow" aria-hidden />
            <div className="cta-band__content">
              <h2>Find the one you&apos;ll live in</h2>
              <p>
                Browse the full collection, or message us and we&apos;ll help you
                choose the right weight and colour.
              </p>
              <div className="cta-band__actions">
                <Link href="/shop" className="btn btn--gold btn--hero">
                  Shop all shawls
                  <span className="btn__arrow" aria-hidden>
                    →
                  </span>
                </Link>
                <a
                  className="btn btn--ghost-light"
                  href={`https://wa.me/${brand.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
