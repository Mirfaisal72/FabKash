import { sanityReadClient } from "./client";
import {
  categoriesQuery,
  featuredProductsQuery,
  orderByIdQuery,
  ordersQuery,
  paidOrdersQuery,
  productBySlugQuery,
  productsByIdsQuery,
  productsQuery,
} from "./types";
import type { SanityCategory, SanityOrder, SanityProduct } from "./types";

export async function getCategories(): Promise<SanityCategory[]> {
  return sanityReadClient.fetch(categoriesQuery);
}

export async function getProducts(categorySlug?: string): Promise<SanityProduct[]> {
  const products = await sanityReadClient.fetch<SanityProduct[]>(productsQuery);
  if (!categorySlug) return products;
  return products.filter((p) => p.category?.slug === categorySlug);
}

export async function getFeaturedProducts(): Promise<SanityProduct[]> {
  return sanityReadClient.fetch(featuredProductsQuery);
}

export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  return sanityReadClient.fetch(productBySlugQuery, { slug });
}

export async function getProductsByIds(ids: string[]): Promise<SanityProduct[]> {
  if (!ids.length) return [];
  return sanityReadClient.fetch(productsByIdsQuery, { ids });
}

export async function getOrders(): Promise<SanityOrder[]> {
  return sanityReadClient.fetch(ordersQuery);
}

export async function getOrderById(id: string): Promise<SanityOrder | null> {
  return sanityReadClient.fetch(orderByIdQuery, { id });
}

export async function getPaidOrders(limit?: number): Promise<SanityOrder[]> {
  const orders = await sanityReadClient.fetch<SanityOrder[]>(paidOrdersQuery);
  return limit ? orders.slice(0, limit) : orders;
}

export async function getShopStats() {
  const [products, orders] = await Promise.all([
    sanityReadClient.fetch<SanityProduct[]>(productsQuery),
    sanityReadClient.fetch<SanityOrder[]>(ordersQuery),
  ]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const pendingOrders = paidOrders.filter((o) =>
    ["new", "packing"].includes(o.fulfillmentStatus),
  );
  const lowStock = products.filter((p) => p.stock <= 3).length;

  return {
    productCount: products.length,
    paidOrders: paidOrders.length,
    pendingOrders: pendingOrders.length,
    lowStock,
  };
}
