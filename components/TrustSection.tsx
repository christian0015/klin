"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TRUST SECTION — §06
// Fond blanc cassé #F5F5F5 — rupture volontaire avec le noir ambiant
// 3 piliers max, géométrie fine, typographie sobre
// ─────────────────────────────────────────────────────────────────────────────

const pillars = [
  {
    id: 1,
    num: "I",
    title: "Paiement à la livraison",
    body: "Aucun prépaiement. Vous payez en main propre à la réception de votre commande.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="7" width="24" height="17" rx="1.5" stroke="currentColor" strokeWidth="1" />
        <path d="M2 12h24" stroke="currentColor" strokeWidth="1" />
        <path d="M6 17h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M6 20h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 2,
    num: "II",
    title: "Livraison rapide",
    body: "Commandez aujourd'hui. Reçu sous 24–48h sur Casablanca, livraison directe à domicile.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M3 18h14V8H3v10z" stroke="currentColor" strokeWidth="1" />
        <path d="M17 11h5l3 4v3h-8V11z" stroke="currentColor" strokeWidth="1" />
        <circle cx="8" cy="20" r="2" stroke="currentColor" strokeWidth="1" />
        <circle cx="21" cy="20" r="2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 3,
    num: "III",
    title: "Pièces sélectionnées",
    body: "Chaque article est choisi pour sa qualité, sa coupe et sa durabilité. Rien de superflu.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L14 17.3l-5.6 2.9 1.1-6.2L5 9.6l6.2-.9L14 3z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>

      <section
        ref={sectionRef}
        className={`ts ${visible ? "ts--visible" : ""}`}
        aria-label="Nos engagements"
      >
        {/* ── Trait géo haut ── */}
        <div className="ts-geo-top" aria-hidden="true">
          <span className="ts-geo-top__line" />
          <span className="ts-geo-top__square" />
          <span className="ts-geo-top__line" />
        </div>

        {/* ── Header ── */}
        <div className="ts-header">
          <div className="ts-header__label">
            <span className="ts-label-num">06</span>
            <span className="ts-label-dash" />
            <span className="ts-label-text">ENGAGEMENTS</span>
          </div>
          <h2 className="ts-header__title">
            Ce qui ne<br />change pas.
          </h2>
          <div className="ts-header__accent" aria-hidden="true">
            <span className="ts-header__accent-line" />
            <span className="ts-header__accent-dot" />
          </div>
        </div>

        {/* ── Piliers ── */}
        <div className="ts-pillars" role="list">
          {pillars.map((p, i) => (
            <article
              key={p.id}
              className="ts-pillar"
              role="listitem"
              style={{ "--p-index": i } as React.CSSProperties}
            >
              {/* Numéro romain superposé */}
              <span className="ts-pillar__watermark" aria-hidden="true">{p.num}</span>

              {/* Icône */}
              <div className="ts-pillar__icon" aria-hidden="true">
                {p.icon}
              </div>

              {/* Séparateur */}
              <div className="ts-pillar__rule" aria-hidden="true">
                <span className="ts-pillar__rule-line" />
                <span className="ts-pillar__rule-dot" />
              </div>

              {/* Texte */}
              <h3 className="ts-pillar__title">{p.title}</h3>
              <p className="ts-pillar__body">{p.body}</p>

              {/* Coin déco */}
              <span className="ts-pillar__corner ts-pillar__corner--br" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* ── Signature bas ── */}
        <div className="ts-signature" aria-hidden="true">
          <span className="ts-signature__text">KLIN</span>
          <span className="ts-signature__line" />
          <span className="ts-signature__sub">MODE MINIMALISTE PREMIUM — CASABLANCA</span>
        </div>

      </section>
    </>
  );
}

const styles = `
/* ── Root — fond blanc cassé ── */
.ts {
  position: relative;
  width: 100%;
  background: #cfcfcf;
  padding: 100px 0 80px;
  overflow: hidden;
}

/* ── Géométrie haute ── */
.ts-geo-top {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 72px;
  padding: 0 80px;
}

.ts-geo-top__line {
  flex: 1;
  height: 1px;
  background: rgba(0,0,0,0.08);
}

.ts-geo-top__square {
  display: block;
  width: 5px;
  height: 5px;
  border: 1px solid rgba(0,0,0,0.2);
  transform: rotate(45deg);
  margin: 0 16px;
}

/* ── Header ── */
.ts-header {
  padding: 0 80px;
  margin-bottom: 72px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.ts--visible .ts-header { opacity: 1; transform: none; }

.ts-header__label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.ts-label-num {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  color: #B5A485;
  letter-spacing: 0.1em;
}

.ts-label-dash {
  display: block;
  width: 28px;
  height: 1px;
  background: rgba(0,0,0,0.15);
}

.ts-label-text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  color: rgba(0,0,0,0.3);
  text-transform: uppercase;
}

.ts-header__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2.8rem, 5vw, 5rem);
  font-weight: 300;
  color: #0B0B0B;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.ts-header__accent {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

.ts-header__accent-line {
  display: block;
  width: 56px;
  height: 1px;
  background: #D6C3A3;
}

.ts-header__accent-dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #D6C3A3;
}

/* ── Piliers ── */
.ts-pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 0 80px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.ts-pillar {
  position: relative;
  padding: 48px 48px 48px 0;
  border-right: 1px solid rgba(0,0,0,0.06);
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--p-index, 0) * 0.15s + 0.2s);
}

.ts--visible .ts-pillar { opacity: 1; transform: none; }

.ts-pillar:last-child { border-right: none; }

.ts-pillar:not(:first-child) { padding-left: 48px; }

/* Watermark */
.ts-pillar__watermark {
  position: absolute;
  top: 24px;
  right: 24px;
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 4rem;
  font-weight: 200;
  color: rgba(0,0,0,0.04);
  line-height: 1;
  user-select: none;
  pointer-events: none;
  letter-spacing: -0.02em;
  transition: color 0.4s ease;
}

.ts-pillar:hover .ts-pillar__watermark {
  color: rgba(214,195,163,0.15);
}

/* Icône */
.ts-pillar__icon {
  color: #B5A485;
  margin-bottom: 24px;
  transition: color 0.3s ease, transform 0.3s ease;
}

.ts-pillar:hover .ts-pillar__icon {
  color: #8a7a65;
  transform: translateY(-2px);
}

/* Règle */
.ts-pillar__rule {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.ts-pillar__rule-line {
  display: block;
  width: 32px;
  height: 1px;
  background: rgba(0,0,0,0.12);
  transition: width 0.4s ease;
}

.ts-pillar:hover .ts-pillar__rule-line { width: 48px; }

.ts-pillar__rule-dot {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #D6C3A3;
}

/* Titre pilier */
.ts-pillar__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.4rem;
  font-weight: 400;
  color: #0B0B0B;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin-bottom: 14px;
}

/* Texte */
.ts-pillar__body {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.8rem;
  font-weight: 300;
  color: rgba(0,0,0,0.45);
  line-height: 1.8;
  letter-spacing: 0.02em;
  max-width: 260px;
}

/* Coin déco */
.ts-pillar__corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: rgba(214,195,163,0.5);
  border-style: solid;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ts-pillar:hover .ts-pillar__corner { opacity: 1; }

.ts-pillar__corner--br {
  bottom: 16px;
  right: 24px;
  border-width: 0 1px 1px 0;
}

/* ── Signature ── */
.ts-signature {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 40px 80px 0;
  margin-top: 64px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.ts-signature__text {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1rem;
  font-weight: 300;
  font-style: italic;
  color: rgba(0,0,0,0.2);
  letter-spacing: 0.08em;
}

.ts-signature__line {
  flex: 1;
  height: 1px;
  background: rgba(0,0,0,0.06);
}

.ts-signature__sub {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 300;
  color: rgba(0,0,0,0.2);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 960px) {
  .ts-geo-top,
  .ts-header,
  .ts-signature { padding: 0 24px; }
  .ts-pillars {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }
  .ts-pillar {
    border-right: none;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    padding: 36px 0;
  }
  .ts-pillar:not(:first-child) { padding-left: 0; }
  .ts-pillar:last-child { border-bottom: none; }
}
`;
