"use client";

import Image from "next/image";
import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatInr } from "@/lib/brand";
import { imageUrl, imageUrls } from "@/sanity/image";
import type { SanityProduct } from "@/sanity/types";

export function ProductView({
  product,
  categoryName,
}: {
  product: SanityProduct;
  categoryName?: string | null;
}) {
  const images = imageUrls(product.images);
  const [active, setActive] = useState(0);
  const main = images[active] || "/placeholders/shawl.svg";

  return (
    <div className="page-shell product-detail">
      <div className="gallery">
        <div className="gallery__main">
          <Image
            src={main}
            alt={product.name}
            width={1000}
            height={1250}
            priority
          />
        </div>
        {images.length > 1 ? (
          <div className="gallery__thumbs">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={i === active ? "is-active" : undefined}
                onClick={() => setActive(i)}
              >
                <Image src={src} alt="" width={200} height={200} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-copy">
        <p className="eyebrow">{categoryName || product.fabric}</p>
        <h1>{product.name}</h1>
        <p className="price" style={{ fontSize: "1.25rem" }}>
          {formatInr(product.priceInr)}
        </p>
        <p className="lead">{product.description}</p>
        <ul className="specs">
          <li>
            <strong>Fabric:</strong> {product.fabric}
          </li>
          <li>
            <strong>Colors:</strong> {product.colors}
          </li>
          <li>
            <strong>Stock:</strong>{" "}
            {product.stock > 0 ? `${product.stock} available` : "Sold out"}
          </li>
        </ul>
        <AddToCartButton
          productId={product._id}
          slug={product.slug}
          name={product.name}
          priceInr={product.priceInr}
          image={imageUrl(product.images?.[0])}
          stock={product.stock}
        />
      </div>
    </div>
  );
}
