export const brand = {
  name: "Phamb Kashmir",
  tagline: "Soft luxury you can wrap around yourself",
  description:
    "Hand-picked shawls in wool, pashmina blends, and fine weaves — made to drape, gift, and wear through every season.",
  whatsapp: "7006162077",
  instagram: "fabkash.handloom",
  email: "hello@fabkash.com",
  currency: "INR" as const,
  /** Full-bleed homepage hero — local Kashmiri pashmina / Sozni embroidery photo */
  heroImage: "/hero-shawl.jpg",
  heroImagePosition: "center 40%",
};

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
