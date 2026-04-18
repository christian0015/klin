"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { products } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// STYLE SECTION — Composant 3
// Focus visuel pur : grid immersive, peu de texte, effet transformation style
// Vibe : éditorial fashion, plein écran, respirant, géométrique
// ─────────────────────────────────────────────────────────────────────────────

export default function StyleSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll reveal sur chaque cellule
  useEffect(() => {
    const cells = rootRef.current?.querySelectorAll<HTMLElement>(".ss-cell");
    if (!cells) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-in", "true");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    cells.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>

      <section className="ss" ref={rootRef} aria-label="Style KLIN — galerie">

        {/* ── Header éditorial ── */}
        <div className="ss-header">
          <div className="ss-header__left">
            <span className="ss-header__index">03</span>
            <span className="ss-header__dash" />
            <span className="ss-header__label">STYLE</span>
          </div>

          <div className="ss-header__center">
            <h2 className="ss-title">
              <span className="ss-title__line">L'essentiel,</span>
              <em className="ss-title__em">maîtrisé.</em>
            </h2>
          </div>

          <div className="ss-header__right" aria-hidden="true">
            <span className="ss-header__tag">COLLECTION 2025</span>
          </div>
        </div>

        {/* ── Ligne séparatrice géométrique ── */}
        <div className="ss-divider" aria-hidden="true">
          <span className="ss-divider__line" />
          <span className="ss-divider__dot" />
          <span className="ss-divider__dot" />
          <span className="ss-divider__dot" />
          <span className="ss-divider__line" />
        </div>

        {/* ── Grille principale ── */}
        <div className="ss-grid">

          {/* Cellule 1 — grande, colonne 1, lignes 1-2 */}
          <div className="ss-cell ss-cell--large" style={{ "--delay": "0s" } as React.CSSProperties}>
            <div className="ss-cell__img-wrap">
              <Image
                src={products[2].media[0]}
                alt={products[2].name}
                fill
                className="ss-cell__img"
                sizes="(max-width:768px) 100vw, 40vw"
              />
              <div className="ss-cell__overlay" />
              <div className="ss-cell__glow" />
            </div>

            <div className="ss-cell__info">
              <span className="ss-cell__tag">SILENT POWER</span>
              <span className="ss-cell__name">{products[2].name}</span>
            </div>

            {/* Coin géo */}
            <span className="ss-corner ss-corner--tl" aria-hidden="true" />
          </div>

          {/* Cellule 2 — petite haute, colonne 2 */}
          <div className="ss-cell ss-cell--small-top" style={{ "--delay": "0.15s" } as React.CSSProperties}>
            <div className="ss-cell__img-wrap">
              <Image
                src={products[1].media[0]}
                alt={products[1].name}
                fill
                className="ss-cell__img"
                sizes="(max-width:768px) 100vw, 30vw"
              />
              <div className="ss-cell__overlay" />
            </div>

            <div className="ss-cell__info">
              <span className="ss-cell__tag">PURE ESSENTIAL</span>
              <span className="ss-cell__name">{products[1].name}</span>
            </div>
          </div>

          {/* Cellule 3 — petite basse, colonne 2 */}
          <div className="ss-cell ss-cell--small-bot" style={{ "--delay": "0.3s" } as React.CSSProperties}>
            <div className="ss-cell__img-wrap">
              <Image
                src={products[0].media[0]}
                alt={products[0].name}
                fill
                className="ss-cell__img"
                sizes="(max-width:768px) 100vw, 30vw"
              />
              <div className="ss-cell__overlay" />
              <div className="ss-cell__glow" />
            </div>

            <div className="ss-cell__info">
              <span className="ss-cell__tag">RAW ELEGANCE</span>
              <span className="ss-cell__name">{products[0].name}</span>
            </div>

            {/* Coin géo */}
            <span className="ss-corner ss-corner--br" aria-hidden="true" />
          </div>

        </div>

        {/* ── Texte défilant bas ── */}
        <div className="ss-ticker" aria-hidden="true">
          <div className="ss-ticker__track">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="ss-ticker__item">
                KLIN&nbsp;&nbsp;·&nbsp;&nbsp;MINIMALISME&nbsp;&nbsp;·&nbsp;&nbsp;CASABLANCA&nbsp;&nbsp;·&nbsp;&nbsp;PREMIUM&nbsp;&nbsp;·&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── Phrase éditoriale bas ── */}
        <div className="ss-footer">
          <span className="ss-footer__line" />
          <p className="ss-footer__phrase">
            Chaque pièce parle à ta place.
          </p>
          <span className="ss-footer__line" />
        </div>

      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const css = `

/* ── Root ── */
.ss {
  position: relative;
  width: 100%;
  background: #0B0B0B;
  overflow: hidden;
  padding-bottom: 0;
}

/* ── Header ── */
.ss-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 5rem 80px 2.5rem;
  gap: 24px;
}

@media (max-width: 768px) {
  .ss-header { padding: 4rem 24px 2rem; flex-wrap: wrap; gap: 16px; }
}

.ss-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ss-header__index {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  color: var(--accent, #D6C3A3);
  letter-spacing: 0.1em;
  font-weight: 300;
}

.ss-header__dash {
  display: block;
  width: 28px;
  height: 1px;
  background: #3A3A3A;
}

.ss-header__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: #5A5A5A;
  text-transform: uppercase;
}

.ss-header__center { flex: 1; text-align: center; }

.ss-title {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 0.9;
}

.ss-title__line {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

.ss-title__em {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--accent, #D6C3A3);
  letter-spacing: -0.02em;
}

.ss-header__right {
  text-align: right;
}

.ss-header__tag {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  color: #3A3A3A;
  text-transform: uppercase;
}

/* ── Séparateur ── */
.ss-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 80px;
  margin-bottom: 2px;
}

@media (max-width: 768px) { .ss-divider { padding: 0 24px; } }

.ss-divider__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.04);
}

.ss-divider__dot {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--accent, #D6C3A3);
  opacity: 0.3;
}

/* ── Grille ── */
.ss-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  grid-template-rows: auto auto;
  gap: 3px;
  padding: 0 80px;
  min-height: 85vh;
}

@media (max-width: 768px) {
  .ss-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    padding: 0 24px;
    gap: 3px;
  }
}

/* ── Cellules ── */
.ss-cell {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transform: translateY(40px) scale(0.97);
  transition:
    opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--delay, 0s),
    transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--delay, 0s);
}

.ss-cell[data-in="true"] {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Grande cellule : colonne 1, lignes 1 + 2 */
.ss-cell--large {
  grid-row: 1 / 3;
  min-height: 80vh;
}

@media (max-width: 768px) {
  .ss-cell--large { grid-row: auto; min-height: 60vw; }
}

.ss-cell--small-top,
.ss-cell--small-bot {
  min-height: 39vh;
}

@media (max-width: 768px) {
  .ss-cell--small-top,
  .ss-cell--small-bot { min-height: 55vw; }
}

/* Image */
.ss-cell__img-wrap {
  position: absolute;
  inset: 0;
}

.ss-cell__img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.ss-cell:hover .ss-cell__img {
  transform: scale(1.04);
}

/* Overlays */
.ss-cell__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(11,11,11,0.1) 0%,
    transparent 40%,
    rgba(11,11,11,0.7) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.ss-cell__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 50% 30% at 50% 60%,
    rgba(214,195,163,0.07) 0%,
    transparent 70%
  );
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.ss-cell:hover .ss-cell__glow { opacity: 1; }

/* Info bas de cellule */
.ss-cell__info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 24px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform: translateY(4px);
  transition: transform 0.4s ease;
}

.ss-cell:hover .ss-cell__info { transform: translateY(0); }

.ss-cell__tag {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  color: var(--accent, #D6C3A3);
  text-transform: uppercase;
}

.ss-cell__name {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: 0.02em;
}

/* Coins géo */
.ss-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(214,195,163,0.35);
  border-style: solid;
  z-index: 10;
  pointer-events: none;
}
.ss-corner--tl { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
.ss-corner--br { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }

/* ── Ticker bas ── */
.ss-ticker {
  width: 100%;
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 14px 0;
  margin-top: 3px;
  background: #0D0D0D;
}

.ss-ticker__track {
  display: flex;
  white-space: nowrap;
  animation: ss-ticker-scroll 24s linear infinite;
}

@keyframes ss-ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.ss-ticker__item {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #3A3A3A;
  text-transform: uppercase;
  padding-right: 0;
  flex-shrink: 0;
}

/* ── Footer phrase ── */
.ss-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 3rem 80px;
}

@media (max-width: 768px) { .ss-footer { padding: 2.5rem 24px; } }

.ss-footer__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
}

.ss-footer__phrase {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 300;
  font-style: italic;
  color: #5A5A5A;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
`;