export const brand = {
  name: "Phamb Kashmir",
  tagline: "Soft luxury you can wrap around yourself",
  description:
    "Hand-picked shawls in wool, pashmina blends, and fine weaves — made to drape, gift, and wear through every season.",
  whatsapp: "7006162077",
  instagram: "fabkash.handloom",
  email: "hello@fabkash.com",
  currency: "INR" as const,
  /** Full-bleed homepage hero — HD fabric / wrap photography */
  heroImage:
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=2400&q=90",
};

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
