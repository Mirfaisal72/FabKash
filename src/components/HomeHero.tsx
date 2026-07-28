"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { brand } from "@/lib/brand";

/**
 * A single Kashmiri "buta" (paisley) motif — the signature form of Sozni
 * embroidery. Drawn as fine strokes with French-knot dots so it reads as
 * needlework rather than clip-art. Colour comes from `currentColor`.
 */
function Buta({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 210 210"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* outer teardrop, curling to a fine tip */}
        <path
          d="M120 14 C74 14 34 52 34 104 C34 158 78 196 128 196 C170 196 200 166 200 126 C200 88 172 60 134 60 C104 60 82 82 82 110 C82 132 99 149 121 149 C137 149 149 138 149 123"
          strokeWidth="2.2"
          opacity="0.95"
        />
        {/* inner echo */}
        <path
          d="M120 40 C86 40 58 70 58 110 C58 150 90 180 128 180 C158 180 180 158 180 130"
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* French-knot dots along the spine */}
        {[
          [120, 30],
          [150, 47],
          [174, 74],
          [186, 108],
          [180, 146],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.6" fill="currentColor" stroke="none" opacity="0.85" />
        ))}
        {/* little sprig inside the curl */}
        <path d="M121 149 C121 133 111 122 99 120" strokeWidth="1.3" opacity="0.6" />
        <path d="M108 108 C116 104 126 106 130 114" strokeWidth="1.3" opacity="0.55" />
      </g>
    </svg>
  );
}

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);

  // Gentle mouse-parallax on the motif layers. Pointer position is smoothed
  // with a lerp and pushed to CSS custom properties the layers read from.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty("--px", cx.toFixed(4));
      root.style.setProperty("--py", cy.toFixed(4));
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero__canvas" aria-hidden>
        <div className="hero__weave" />
        <div className="hero__aurora" />
        <Buta className="hero__buta hero__buta--xl" style={{ ["--depth" as string]: "26" }} />
        <Buta className="hero__buta hero__buta--lg" style={{ ["--depth" as string]: "42" }} />
        <Buta className="hero__buta hero__buta--sm" style={{ ["--depth" as string]: "60" }} />
        <Buta className="hero__buta hero__buta--tip" style={{ ["--depth" as string]: "80" }} />
        <div className="hero__grain" />
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-dot" />
          Handwoven in Kashmir
        </p>
        <h1 className="hero__title">
          <span className="hero__title-line">{firstWord(brand.name)}</span>
          <span className="hero__title-line hero__title-line--accent">
            {restWords(brand.name)}
          </span>
        </h1>
        <p className="hero__support">
          Hand-finished wraps in wool and pashmina blends — soft drape, fine
          weave, and the quiet elegance of Kashmir craft.
        </p>
        <div className="hero__actions">
          <Link href="/shop" className="btn btn--gold btn--hero">
            Shop the collection
            <span className="btn__arrow" aria-hidden>
              →
            </span>
          </Link>
          <a
            className="btn btn--ghost-light"
            href={`https://wa.me/${brand.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>
        </div>
        <ul className="hero__chips" aria-label="What makes our shawls special">
          <li>Pashmina &amp; fine wool</li>
          <li>Sozni hand-embroidery</li>
          <li>Ships worldwide</li>
        </ul>
      </div>

      <a className="hero__scroll" href="#featured" aria-label="Scroll to collection">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </a>
    </section>
  );
}

function firstWord(name: string) {
  return name.trim().split(/\s+/)[0];
}

function restWords(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : " ";
}
