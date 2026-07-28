"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { useCart } from "./CartProvider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);

  const overHero = pathname === "/";

  // On the homepage the header floats transparently over the hero, then turns
  // into a solid frosted bar once the hero is scrolled past.
  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  const hide = pathname.startsWith("/admin") || pathname.startsWith("/studio");
  if (hide) return null;

  const floating = overHero && !scrolled;

  const className = [
    "site-header",
    overHero ? "site-header--fixed" : "",
    floating ? "site-header--over-hero" : "",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={className}>
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
