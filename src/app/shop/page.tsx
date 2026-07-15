import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { isSanityConfigured } from "@/sanity/env";
import { getCategories, getProducts } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop",
};

type Search = { category?: string };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;

  if (!isSanityConfigured()) {
    return (
      <section className="section">
        <div className="page-shell">
          <p className="muted">Connect Sanity first — see README.</p>
        </div>
      </section>
    );
  }

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(params.category),
  ]);

  return (
    <section className="section">
      <div className="page-shell">
        <div className="section__head">
          <p className="eyebrow">Catalog</p>
          <h2>Shop shawls</h2>
          <p className="muted">
            Products come from Sanity CMS. Manage them at{" "}
            <Link href="/studio">/studio</Link>.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <a
            className={`btn ${!params.category ? "btn--primary" : "btn--ghost"}`}
            href="/shop"
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat._id}
              className={`btn ${
                params.category === cat.slug ? "btn--primary" : "btn--ghost"
              }`}
              href={`/shop?category=${cat.slug}`}
            >
              {cat.name}
            </a>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="muted">
            No shawls yet. Add them in <Link href="/studio">Sanity Studio</Link>.
          </p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
