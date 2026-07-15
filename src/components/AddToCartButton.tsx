"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type Props = {
  productId: string;
  slug: string;
  name: string;
  priceInr: number;
  image: string;
  stock: number;
};

export function AddToCartButton(props: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (props.stock <= 0) {
    return (
      <button type="button" className="btn btn--ghost" disabled>
        Sold out
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn btn--primary"
      onClick={() => {
        addItem(props, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
