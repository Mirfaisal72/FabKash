"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { useCart } from "./CartProvider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const hide = pathname.startsWith("/admin") || pathname.startsWith("/studio");

  if (hide) return null;

  const overHero = pathname === "/";

  return (
    <header className={`site-header${overHero ? " site-header--over-hero" : ""}`}>
      <div className="site-header__inner">
        <Link href="/" className="brand-mark" aria-label={`${brand.name} home`}>
          {brand.name}
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "is-active" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="cart-link">
            Cart
            {count > 0 ? <span className="cart-count">{count}</span> : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
