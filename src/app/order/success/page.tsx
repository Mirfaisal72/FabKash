import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata = { title: "Order confirmed" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="page-shell" style={{ padding: "4rem 0" }}>
      <p className="eyebrow">Thank you</p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          letterSpacing: "-0.03em",
        }}
      >
        Order received
      </h1>
      <p className="muted" style={{ maxWidth: "40ch", marginTop: "0.75rem" }}>
        {order
          ? `Your order ${order} is confirmed. We’ll pack it shortly.`
          : "Your payment went through. We’ll pack it shortly."}
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
        <Link href="/shop" className="btn btn--primary">
          Continue shopping
        </Link>
        <a
          className="btn btn--ghost"
          href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
            `Hi ${brand.name}, I just placed order ${order || ""}.`,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
}
