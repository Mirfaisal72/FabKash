import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityReadClient } from "./client";

const builder = createImageUrlBuilder(sanityReadClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function imageUrl(
  source: SanityImageSource | undefined,
  width = 1200,
): string {
  if (!source) return "/placeholders/shawl.svg";
  return urlFor(source).width(width).auto("format").url();
}

export function imageUrls(
  sources: SanityImageSource[] | undefined,
  width = 1200,
): string[] {
  if (!sources?.length) return [];
  return sources.map((src) => imageUrl(src, width));
}
