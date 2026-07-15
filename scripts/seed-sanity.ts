import "dotenv/config";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env first.",
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

const sampleImages = [
  "https://images.unsplash.com/photo-1601924999981-b98e1e8e2c88?w=1200&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80",
];

async function uploadFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: "shawl.jpg",
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

async function main() {
  const existing = await client.fetch<number>(
    `count(*[_type in ["category", "product"]])`,
  );
  if (existing > 0) {
    console.log("Sanity already has content. Skipping seed.");
    console.log("Delete content in Studio first if you want a fresh seed.");
    return;
  }

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
      imageIndex: 0,
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
      imageIndex: 1,
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
      imageIndex: 2,
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
      imageIndex: 4,
    },
  ];

  for (const p of products) {
    const image = await uploadFromUrl(sampleImages[p.imageIndex]);
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

  console.log("Done! Open /studio to edit products.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
