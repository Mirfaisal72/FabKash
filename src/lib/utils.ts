export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceInr: number;
  image: string;
  quantity: number;
  stock: number;
};

export function orderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `LM-${stamp}-${rand}`;
}
