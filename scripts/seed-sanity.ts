import "dotenv/config";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (
  !projectId ||
  !token ||
  projectId.startsWith("PASTE_HERE") ||
  token.startsWith("PASTE_HERE")
) {
  console.error(
    "Set real NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env first.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

/** Tiny 1x1 PNG — replace with real shawl photos in Studio. */
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function uploadPlaceholder(filename: string) {
  const asset = await client.assets.upload("image", PLACEHOLDER_PNG, {
    filename,
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
    alt: filename,
  };
}

async function main() {
  const force = process.argv.includes("--force");
  const existingIds = await client.fetch<string[]>(
    `*[_type in ["category", "product"]]._id`,
  );
  if (existingIds.length > 0 && !force) {
    console.log("Sanity already has content. Skipping seed.");
    console.log("Run: npm run seed:sanity -- --force");
    console.log("Or delete Category/Product docs in Studio, then seed again.");
    return;
  }
  if (force && existingIds.length > 0) {
    console.log(`Removing ${existingIds.length} existing docs...`);
    for (const id of existingIds) {
      await client.delete(id);
    }
  }

  console.log("Creating categories...");
  const pashmina = await client.create({
    _type: "category",
    name: "Pashmina Blend",
    slug: { _type: "slug", current: "pashmina-blend" },
  });
  const wool = await client.create({
    _type: "category",
    name: "Wool",
    slug: { _type: "slug", current: "wool" },
  });
  const embroidered = await client.create({
    _type: "category",
    name: "Embroidered",
    slug: { _type: "slug", current: "embroidered" },
  });

  const products = [
    {
      name: "Midnight Cascade",
      slug: "midnight-cascade",
      description:
        "A deep ink wool wrap with a soft hand-feel and generous drape. Ideal for evenings and travel.",
      priceInr: 2899,
      fabric: "Fine wool",
      colors: "Charcoal, Ink",
      stock: 12,
      featured: true,
      categoryId: wool._id,
    },
    {
      name: "Pearl Meadow",
      slug: "pearl-meadow",
      description:
        "Light pashmina-blend shawl in soft pearl tones. Packs flat, wears warm without bulk.",
      priceInr: 3499,
      fabric: "Pashmina blend",
      colors: "Pearl, Mist",
      stock: 8,
      featured: true,
      categoryId: pashmina._id,
    },
    {
      name: "Saffron Thread",
      slug: "saffron-thread",
      description:
        "Warm copper-toned shawl with fine edge detailing. An everyday statement wrap.",
      priceInr: 3199,
      fabric: "Wool blend",
      colors: "Saffron, Copper",
      stock: 10,
      featured: true,
      categoryId: wool._id,
    },
    {
      name: "Kashmir Echo",
      slug: "kashmir-echo",
      description:
        "Classic pashmina-inspired drape with subtle border embroidery. Gift-ready.",
      priceInr: 4299,
      fabric: "Pashmina blend",
      colors: "Ivory, Soft grey",
      stock: 6,
      featured: true,
      categoryId: embroidered._id,
    },
  ];

  console.log("Creating products...");
  for (const p of products) {
    const image = await uploadPlaceholder(`${p.slug}.png`);
    await client.create({
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      description: p.description,
      priceInr: p.priceInr,
      fabric: p.fabric,
      colors: p.colors,
      stock: p.stock,
      featured: p.featured,
      active: true,
      category: { _type: "reference", _ref: p.categoryId },
      images: [image],
    });
    console.log(`Created ${p.name}`);
  }

  console.log("Done! Open http://localhost:3000/studio and add real photos.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
