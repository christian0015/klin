"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT SECTION — §05
// Logique : style → envie → preuve → achat
// Layout : grille éditorial asymétrique, vidéos lifestyle + produit lié
// Chaque carte = vidéo (ou image fallback) + label + lien produit
// ─────────────────────────────────────────────────────────────────────────────

const contentItems = [
  {
    id: 1,
    label: "Raw elegance",
    caption: "La veste cuir marron — portée dans la rue, portée partout.",
    media: "/products/haut-cuir-maron.jpeg",
    video: null, // remplacer par "/videos/clip-cuir.mp4" si disponible
    product: products[0],
    tag: "01 — STATEMENT PIECE",
    size: "large", // occupe 2 colonnes
  },
  {
    id: 2,
    label: "Pure essential",
    caption: "Le t-shirt blanc : base de chaque tenue réussie.",
    media: "/products/haut-tchirt-blanc.jpeg",
    video: null,
    product: products[1],
    tag: "02 — EVERYDAY",
    size: "small",
  },
  {
    id: 3,
    label: "Silent power",
    caption: "Veste noire. Zéro détail inutile.",
    media: "/products/haut-veste001-noir.jpeg",
    video: null,
    product: products[2],
    tag: "03 — SIGNATURE",
    size: "small",
  },
  {
    id: 4,
    label: "The uniform",
    caption: "Trois pièces. Infinité de styles.",
    media: "/products/haut-cuir-maron.jpeg",
    video: null,
    product: products[0],
    tag: "04 — COLLECTION",
    size: "medium",
  },
];

export default function ContentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>

      <section
        ref={sectionRef}
        className={`cs ${visible ? "cs--visible" : ""}`}
        aria-label="Contenu lifestyle KLIN"
      >
        {/* ── Header section ── */}
        <div className="cs-header">
          <div className="cs-header__left">
            <span className="cs-num">05</span>
            <span className="cs-num__dash" />
            <span className="cs-num__label">LIFESTYLE</span>
          </div>
          <div className="cs-header__center">
            <h2 className="cs-title">
              <em>Style</em> en mouvement
            </h2>
          </div>
          <div className="cs-header__right">
            <p className="cs-subtitle">
              Quatre façons de le porter.<br />Une seule façon d'être.
            </p>
          </div>
        </div>

        {/* ── Ligne géométrique ── */}
        <div className="cs-rule" aria-hidden="true">
          <span className="cs-rule__line" />
          <span className="cs-rule__dot" />
          <span className="cs-rule__dot" />
          <span className="cs-rule__dot" />
          <span className="cs-rule__line" />
        </div>

        {/* ── Grille contenu ── */}
        <div className="cs-grid">
          {contentItems.map((item, i) => (
            <div
              key={item.id}
              className={`cs-card cs-card--${item.size}`}
              style={{ "--card-index": i } as React.CSSProperties}
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Tag éditorial */}
              <div className="cs-card__tag">{item.tag}</div>

              {/* Média */}
              <div className="cs-card__media">
                {item.video ? (
                  <video
                    src={item.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="cs-card__video"
                    aria-label={item.label}
                  />
                ) : (
                  <Image
                    src={item.media}
                    alt={item.label}
                    fill
                    className="cs-card__img"
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                )}

                {/* Overlays */}
                <div className="cs-card__overlay" aria-hidden="true" />
                <div className={`cs-card__glow ${activeCard === item.id ? "cs-card__glow--active" : ""}`} aria-hidden="true" />

                {/* Coins géo */}
                <span className="cs-corner cs-corner--tl" aria-hidden="true" />
                <span className="cs-corner cs-corner--br" aria-hidden="true" />
              </div>

              {/* Infos bottom */}
              <div className="cs-card__body">
                <div className="cs-card__body-left">
                  <p className="cs-card__label">{item.label}</p>
                  <p className="cs-card__caption">{item.caption}</p>
                </div>
                <Link
                  href={item.product.link}
                  className="cs-card__cta"
                  aria-label={`Voir ${item.product.name}`}
                >
                  <span className="cs-card__cta-text">Voir la pièce</span>
                  <span className="cs-card__cta-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Numéro superposé */}
              <span className="cs-card__num" aria-hidden="true">
                0{item.id}
              </span>
            </div>
          ))}
        </div>

        {/* ── Bande basse ── */}
        <div className="cs-footer" aria-hidden="true">
          <span className="cs-footer__line" />
          <span className="cs-footer__text">KLIN — CONTENU EXCLUSIF</span>
          <span className="cs-footer__line" />
        </div>

      </section>
    </>
  );
}

const styles = `
.cs {
  position: relative;
  width: 100%;
  background: #0B0B0B;
  padding: 100px 0 60px;
  overflow: hidden;
}

/* ── Header ── */
.cs-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: end;
  gap: 24px;
  padding: 0 80px;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.cs--visible .cs-header { opacity: 1; transform: none; }

.cs-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cs-num {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  color: #D6C3A3;
  letter-spacing: 0.1em;
}

.cs-num__dash {
  display: block;
  width: 24px;
  height: 1px;
  background: #2a2a2a;
}

.cs-num__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.28em;
  color: #5A5A5A;
  text-transform: uppercase;
}

.cs-title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1;
  text-align: center;
}

.cs-title em {
  font-style: italic;
  color: #D6C3A3;
}

.cs-subtitle {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.75rem;
  font-weight: 300;
  color: #5A5A5A;
  line-height: 1.8;
  text-align: right;
  letter-spacing: 0.03em;
}

/* ── Règle géo ── */
.cs-rule {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 80px;
  margin-bottom: 48px;
  opacity: 0;
  transition: opacity 0.7s ease 0.15s;
}

.cs--visible .cs-rule { opacity: 1; }

.cs-rule__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.04);
}

.cs-rule__dot {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #2a2a2a;
}

/* ── Grille ── */
.cs-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto auto;
  gap: 2px;
  padding: 0 80px;
}

/* Placement des cartes */
.cs-card--large  { grid-column: span 7; grid-row: span 2; }
.cs-card--small  { grid-column: span 5; }
.cs-card--medium { grid-column: span 5; }

.cs-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--card-index, 0) * 0.12s + 0.2s);
}

.cs--visible .cs-card { opacity: 1; transform: none; }

/* Tag */
.cs-card__tag {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.52rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  color: rgba(214, 195, 163, 0.7);
  text-transform: uppercase;
}

/* Média */
.cs-card__media {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 380px;
  overflow: hidden;
}

.cs-card--large .cs-card__media { min-height: 640px; }
.cs-card--small .cs-card__media { min-height: 300px; }

.cs-card__img,
.cs-card__video {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 100%;
  height: 100%;
}

.cs-card__img { position: absolute; inset: 0; }

.cs-card:hover .cs-card__img,
.cs-card:hover .cs-card__video {
  transform: scale(1.04);
}

.cs-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(11,11,11,0.05) 0%,
    transparent 35%,
    transparent 50%,
    rgba(11,11,11,0.75) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.cs-card__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 50% at 50% 80%, rgba(214,195,163,0.07) 0%, transparent 70%);
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.cs-card__glow--active { opacity: 1; }

/* Coins */
.cs-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: rgba(214,195,163,0.3);
  border-style: solid;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cs-card:hover .cs-corner { opacity: 1; }

.cs-corner--tl { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
.cs-corner--br { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }

/* Body */
.cs-card__body {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 20px 20px 22px;
  gap: 12px;
}

.cs-card__label {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  letter-spacing: 0.01em;
  line-height: 1.1;
  margin-bottom: 4px;
}

.cs-card--large .cs-card__label { font-size: 1.6rem; }

.cs-card__caption {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 300;
  color: #A0A0A0;
  letter-spacing: 0.05em;
  line-height: 1.5;
  max-width: 220px;
}

.cs-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 10px 18px;
  border: 1px solid rgba(214,195,163,0.35);
  background: rgba(11,11,11,0.6);
  backdrop-filter: blur(8px);
  text-decoration: none;
  color: #D6C3A3;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: background 0.3s ease, border-color 0.3s ease;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
}

.cs-card:hover .cs-card__cta {
  opacity: 1;
  transform: none;
}

.cs-card__cta:hover {
  background: rgba(214,195,163,0.12);
  border-color: rgba(214,195,163,0.6);
}

.cs-card__cta-arrow {
  display: flex;
  align-items: center;
  transition: transform 0.25s ease;
}

.cs-card__cta:hover .cs-card__cta-arrow {
  transform: translateX(3px);
}

/* Numéro superposé */
.cs-card__num {
  position: absolute;
  top: 14px;
  right: 18px;
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 4.5rem;
  font-weight: 200;
  color: rgba(255,255,255,0.04);
  line-height: 1;
  z-index: 1;
  user-select: none;
  pointer-events: none;
  transition: color 0.4s ease;
}

.cs-card:hover .cs-card__num { color: rgba(214,195,163,0.06); }

/* ── Footer ── */
.cs-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 40px 80px 0;
  margin-top: 48px;
}

.cs-footer__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.04);
}

.cs-footer__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 300;
  color: #2A2A2A;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 960px) {
  .cs-header { grid-template-columns: 1fr; padding: 0 24px; gap: 12px; }
  .cs-header__right { text-align: left; }
  .cs-title { text-align: left; }
  .cs-rule { padding: 0 24px; }
  .cs-grid {
    grid-template-columns: 1fr;
    gap: 2px;
    padding: 0 24px;
  }
  .cs-card--large,
  .cs-card--small,
  .cs-card--medium { grid-column: span 1; }
  .cs-card--large .cs-card__media { min-height: 480px; }
  .cs-card__cta { opacity: 1; transform: none; }
  .cs-footer { padding: 32px 24px 0; }
}
`;
