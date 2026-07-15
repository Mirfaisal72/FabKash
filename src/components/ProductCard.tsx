import Link from "next/link";
import Image from "next/image";
import { formatInr } from "@/lib/brand";
import { imageUrl } from "@/sanity/image";
import type { SanityProduct } from "@/sanity/types";

export function ProductCard({ product }: { product: SanityProduct }) {
  const image = imageUrl(product.images?.[0]);

  return (
    <article className="product-tile">
      <Link href={`/shop/${product.slug}`} className="product-tile__media">
        <Image
          src={image}
          alt={product.name}
          width={800}
          height={1000}
          className="product-tile__img"
        />
      </Link>
      <div className="product-tile__meta">
        <p className="eyebrow">{product.fabric}</p>
        <h3>
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="price">{formatInr(product.priceInr)}</p>
      </div>
    </article>
  );
}
