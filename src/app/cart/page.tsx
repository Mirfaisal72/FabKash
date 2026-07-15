"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatInr } from "@/lib/brand";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  return (
    <div className="page-shell cart-page">
      <div className="section__head">
        <p className="eyebrow">Your bag</p>
        <h2>Cart</h2>
      </div>

      {items.length === 0 ? (
        <div className="stack-lg">
          <p className="muted">Your cart is empty.</p>
          <Link href="/shop" className="btn btn--primary">
            Browse shawls
          </Link>
        </div>
      ) : (
        <div className="stack-lg">
          <div>
            {items.map((item) => (
              <div className="line-item" key={item.productId}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={88}
                  height={110}
                />
                <div>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-display)" }}>
                    <Link href={`/shop/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <p className="muted" style={{ margin: "0.25rem 0 0" }}>
                    {formatInr(item.priceInr)}
                  </p>
                  <div className="qty-row">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ padding: "0.35rem 0.7rem", marginLeft: "0.5rem" }}
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong>{formatInr(item.priceInr * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="panel">
            <p style={{ margin: "0 0 0.75rem", fontSize: "1.15rem" }}>
              Subtotal <strong>{formatInr(subtotal)}</strong>
            </p>
            <p className="muted" style={{ marginBottom: "1.25rem" }}>
              Shipping is confirmed after checkout. Pay securely with UPI or
              cards via Razorpay.
            </p>
            <Link href="/checkout" className="btn btn--primary">
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
