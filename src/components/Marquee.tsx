const DEFAULT_ITEMS = [
  "Handwoven in Kashmir",
  "Sozni hand-embroidery",
  "Pure pashmina & fine wool",
  "Free shipping over ₹5,000",
  "Gift-wrapped on request",
  "Ships worldwide",
];

/**
 * Seamless infinite ticker. The track is duplicated so the loop has no seam;
 * the copy is marked aria-hidden and the whole strip is decorative.
 */
export function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul className="marquee__group" key={copy}>
            {items.map((item, i) => (
              <li className="marquee__item" key={`${copy}-${i}`}>
                <span className="marquee__star">✦</span>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
