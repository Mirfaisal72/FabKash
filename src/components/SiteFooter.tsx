import Link from "next/link";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="brand-mark brand-mark--footer">{brand.name}</p>
          <p className="muted">{brand.tagline}</p>
        </div>
        <div className="footer-links">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <a
            href={`https://wa.me/${brand.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            href={`https://instagram.com/${brand.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
      <p className="footer-note">
        © {new Date().getFullYear()} {brand.name}. Crafted for everyday warmth.
      </p>
    </footer>
  );
}
