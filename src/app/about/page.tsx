import { brand } from "@/lib/brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="section">
      <div className="page-shell" style={{ maxWidth: "40rem" }}>
        <p className="eyebrow">Our story</p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-0.03em",
            margin: "0.35rem 0 1rem",
          }}
        >
          {brand.name}
        </h1>
        <p style={{ lineHeight: 1.7, fontSize: "1.05rem" }}>{brand.description}</p>
        <p className="muted" style={{ marginTop: "1rem", lineHeight: 1.7 }}>
          You can rename this brand anytime in one config file. Share your own
          photos, WhatsApp number, and Instagram handle when you are ready — we
          will swap them in.
        </p>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "1.75rem" }}>
          <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer">
            WhatsApp · +{brand.whatsapp}
          </a>
          <a
            href={`https://instagram.com/${brand.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram · @{brand.instagram}
          </a>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
      </div>
    </section>
  );
}
