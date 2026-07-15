import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { isSanityConfigured } from "@/sanity/env";
import { getProductBySlug } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSanityConfigured()) return { title: "Product" };
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name || "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSanityConfigured()) notFound();

  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) notFound();

  return (
    <ProductView
      product={product}
      categoryName={product.category?.name}
    />
  );
}
