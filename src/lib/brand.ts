export const brand = {
  name: "FabKash Handloom",
  tagline: "Soft wraps for everyday elegance",
  description:
    "Hand-picked shawls in wool, pashmina blends, and fine weaves — made to drape, gift, and wear through every season.",
  whatsapp: "919876543210",
  instagram: "fabkash.handloom",
  email: "hello@fabkash.com",
  currency: "INR" as const,
};

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
