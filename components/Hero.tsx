"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { brandConfig } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// Layout : split gauche (typo) / droite (visuel)
// Animation : stagger CSS via [data-mounted="true"]
// Vibe : Awwwards · éditorial luxury · respirant
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Micro-délai pour que le navigateur render l'état initial (opacity:0) avant la transition
    const t = setTimeout(() => root.setAttribute("data-mounted", "true"), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <section
        ref={rootRef}
        className="hero"
        aria-label="KLIN — Collection"
      >
        {/* ── Rail gauche — texte vertical éditorial ─────────────────────── */}
        <div className="hero-rail hero-rail--left" aria-hidden="true">
          <span className="hero-rail__text">MODE MINIMALISTE</span>
          <span className="hero-rail__line" />
          <span className="hero-rail__text">PREMIUM</span>
        </div>

        {/* ── Rail droit — texte vertical éditorial ──────────────────────── */}
        <div className="hero-rail hero-rail--right" aria-hidden="true">
          <span className="hero-rail__text">CASABLANCA</span>
          <span className="hero-rail__line" />
          <span className="hero-rail__text">MAROC</span>
        </div>

        {/* ── Contenu principal ──────────────────────────────────────────── */}
        <div className="hero-inner">

          {/* ══ GAUCHE — Typographie ══════════════════════════════════════ */}
          <div className="hero-copy">

            {/* Index éditorial */}
            <div className="hero-index">
              <span className="hero-index__num">01</span>
              <span className="hero-index__dash" />
              <span className="hero-index__label">COLLECTION</span>
            </div>

            {/* Titre principal — chaque lettre animée séparément */}
            <h1 className="hero-title" aria-label="KLIN">
              {["K", "L", "I", "N"].map((char, i) => (
                <span
                  key={char}
                  className="hero-title__char"
                  style={{ "--char-index": i } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Ligne de séparation géométrique */}
            <div className="hero-divider" aria-hidden="true">
              <span className="hero-divider__line" />
              <span className="hero-divider__dot" />
              <span className="hero-divider__dot" />
            </div>

            {/* Sous-titre */}
            <p className="hero-subtitle">
              Des pièces simples.{" "}
              <em className="hero-subtitle__em">Un style maîtrisé.</em>
            </p>

            {/* CTA */}
            <div className="hero-actions">
              <Link href="#collection" className="hero-cta">
                <span className="hero-cta__text">Voir la sélection</span>
                <span className="hero-cta__arrow">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M3 9h12M11 4.5l4.5 4.5-4.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>

              <p className="hero-trust">
                <span className="hero-trust__dot" />
                Paiement à la livraison
                <span className="hero-trust__sep">·</span>
                Livraison Casablanca
              </p>
            </div>

          </div>

          {/* ══ DROITE — Visuel ═══════════════════════════════════════════ */}
          <div className="hero-visual">

            {/* Coins géométriques décoratifs */}
            <span className="hero-corner hero-corner--tl" aria-hidden="true" />
            <span className="hero-corner hero-corner--br" aria-hidden="true" />

            {/* Image produit */}
            <div className="hero-img-wrap">
              <Image
                src="/products/haut-veste001-noir.jpeg"
                alt="Veste noire minimal — KLIN, collection premium"
                fill
                priority
                className="hero-img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Dégradé d'intégration */}
              <div className="hero-img__overlay" aria-hidden="true" />
              {/* Glow produit */}
              <div className="hero-img__glow" aria-hidden="true" />
            </div>

            {/* Badge produit flottant */}
            <div className="hero-badge">
              <span className="hero-badge__label">NO NOISE</span>
              <span className="hero-badge__name">Just presence.</span>
              <span className="hero-badge__price">Disponible maintenant</span>
            </div>

            {/* Indicateur scroll */}
            <div className="hero-scroll" aria-hidden="true">
              <span className="hero-scroll__track">
                <span className="hero-scroll__thumb" />
              </span>
              <span className="hero-scroll__label">SCROLL</span>
            </div>

          </div>

        </div>

        {/* ── Barre basse ────────────────────────────────────────────────── */}
        <div className="hero-bottom" aria-hidden="true">
          <span className="hero-bottom__year">2025</span>
          <span className="hero-bottom__line" />
          <span className="hero-bottom__tag">{brandConfig.tagline}</span>
          <span className="hero-bottom__line" />
          <span className="hero-bottom__count">003 PIÈCES</span>
        </div>

      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES — encapsulés dans le composant pour autonomie totale
// ─────────────────────────────────────────────────────────────────────────────

const styles = `

/* ── Root ── */
.hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #0B0B0B;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Rails verticaux ── */
.hero-rail {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  opacity: 0;
  transition: opacity 1s ease 1.4s;
}

.hero[data-mounted="true"] .hero-rail {
  opacity: 1;
}

.hero-rail--left {
  left: 20px;
  flex-direction: column;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: translateY(-50%) rotate(180deg);
}

.hero-rail--right {
  right: 20px;
  flex-direction: column;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.hero-rail__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  color: #5A5A5A;
  text-transform: uppercase;
  white-space: nowrap;
}

.hero-rail__line {
  display: block;
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, #3a3a3a, transparent);
}

/* ── Intérieur principal ── */
.hero-inner {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 60px;
  gap: 0;
  position: relative;
  z-index: 2;
  padding-left: 80px;
  padding-right: 80px;
}

@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    padding: 120px 24px 80px;
    gap: 48px;
  }
  .hero-rail { display: none; }
}

/* ── COPIE gauche ── */
.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-right: 48px;
  padding-top: 40px;
}

/* Index */
.hero-index {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
}

.hero[data-mounted="true"] .hero-index {
  opacity: 1;
  transform: none;
}

.hero-index__num {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: var(--accent, #D6C3A3);
  letter-spacing: 0.1em;
}

.hero-index__dash {
  display: block;
  width: 28px;
  height: 1px;
  background: #3a3a3a;
}

.hero-index__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  color: #5A5A5A;
  text-transform: uppercase;
}

/* Titre KLIN */
.hero-title {
  display: flex;
  align-items: baseline;
  gap: 0;
  line-height: 0.85;
  margin-bottom: 32px;
  overflow: hidden;
}

.hero-title__char {
  display: inline-block;
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(7rem, 14vw, 13rem);
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  letter-spacing: -0.03em;
  opacity: 0;
  transform: translateY(60px);
  transition:
    opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(0.3s + var(--char-index, 0) * 0.09s);
}

.hero[data-mounted="true"] .hero-title__char {
  opacity: 1;
  transform: translateY(0);
}

/* Séparateur géométrique */
.hero-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s;
}

.hero[data-mounted="true"] .hero-divider {
  opacity: 1;
  transform: scaleX(1);
}

.hero-divider__line {
  display: block;
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, var(--accent, #D6C3A3), transparent);
}

.hero-divider__dot {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--accent, #D6C3A3);
  opacity: 0.5;
}

/* Sous-titre */
.hero-subtitle {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: clamp(0.9rem, 1.4vw, 1.1rem);
  font-weight: 300;
  color: #A0A0A0;
  line-height: 1.7;
  letter-spacing: 0.03em;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 1s, transform 0.8s ease 1s;
  max-width: 360px;
}

.hero[data-mounted="true"] .hero-subtitle {
  opacity: 1;
  transform: none;
}

.hero-subtitle__em {
  font-style: italic;
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.15em;
  color: var(--accent, #D6C3A3);
}

/* Actions */
.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 1.2s, transform 0.8s ease 1.2s;
}

.hero[data-mounted="true"] .hero-actions {
  opacity: 1;
  transform: none;
}

/* CTA bouton */
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  padding: 16px 40px;
  background: var(--accent, #D6C3A3);
  color: #0B0B0B;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.35s ease, transform 0.2s ease;
}

.hero-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.08);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hero-cta:hover::before {
  transform: translateX(0);
}

.hero-cta:hover {
  transform: translateY(-1px);
}

.hero-cta__arrow {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.hero-cta:hover .hero-cta__arrow {
  transform: translateX(4px);
}

/* Trust line */
.hero-trust {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.1em;
}

.hero-trust__dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent, #D6C3A3);
  opacity: 0.6;
}

.hero-trust__sep {
  opacity: 0.3;
}

/* ── VISUEL droit ── */
.hero-visual {
  position: relative;
  height: 80vh;
  max-height: 800px;
  opacity: 0;
  transform: translateX(30px) scale(0.98);
  transition: opacity 1s ease 0.4s, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s;
}

.hero[data-mounted="true"] .hero-visual {
  opacity: 1;
  transform: translateX(0) scale(1);
}

/* Coins géométriques */
.hero-corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border-color: rgba(214, 195, 163, 0.4);
  border-style: solid;
  z-index: 10;
  pointer-events: none;
}

.hero-corner--tl {
  top: -8px;
  left: -8px;
  border-width: 1px 0 0 1px;
}

.hero-corner--br {
  bottom: -8px;
  right: -8px;
  border-width: 0 1px 1px 0;
}

/* Image */
.hero-img-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-img {
  object-fit: cover;
  object-position: center top;
  transition: transform 8s ease;
  transform: scale(1.04);
}

.hero[data-mounted="true"] .hero-img {
  transform: scale(1);
}

.hero-img__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(11, 11, 11, 0.15) 0%,
    transparent 40%,
    transparent 60%,
    rgba(11, 11, 11, 0.6) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.hero-img__overlay::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(to right, #0B0B0B, transparent);
}

/* Glow produit */
.hero-img__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 40% at 50% 60%,
    rgba(214, 195, 163, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 3;
  transition: opacity 0.6s ease;
}

.hero-img-wrap:hover .hero-img__glow {
  opacity: 1.5;
}

/* Badge produit */
.hero-badge {
  position: absolute;
  bottom: 32px;
  left: -24px;
  background: #111111;
  border: 1px solid rgba(255,255,255,0.06);
  border-left: 2px solid var(--accent, #D6C3A3);
  padding: 16px 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.6s ease 1.4s, transform 0.6s ease 1.4s;
}

.hero[data-mounted="true"] .hero-badge {
  opacity: 1;
  transform: translateX(0);
}

.hero-badge__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--accent, #D6C3A3);
  text-transform: uppercase;
}

.hero-badge__name {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1rem;
  font-weight: 400;
  color: #FFFFFF;
  letter-spacing: 0.02em;
}

.hero-badge__price {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.08em;
}

/* Scroll indicator */
.hero-scroll {
  position: absolute;
  bottom: 32px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.6s ease 1.8s;
}

.hero[data-mounted="true"] .hero-scroll {
  opacity: 1;
}

.hero-scroll__track {
  display: block;
  width: 1px;
  height: 48px;
  background: rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}

.hero-scroll__thumb {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: var(--accent, #D6C3A3);
  animation: scroll-thumb 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

@keyframes scroll-thumb {
  0%   { transform: translateY(-100%); }
  50%  { transform: translateY(100%); }
  100% { transform: translateY(200%); }
}

.hero-scroll__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.5rem;
  letter-spacing: 0.25em;
  color: #5A5A5A;
  writing-mode: vertical-rl;
  text-transform: uppercase;
}

/* ── Barre basse ── */
.hero-bottom {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 80px;
  border-top: 1px solid rgba(255,255,255,0.04);
  opacity: 0;
  transition: opacity 0.8s ease 1.6s;
}

.hero[data-mounted="true"] .hero-bottom {
  opacity: 1;
}

.hero-bottom__year,
.hero-bottom__count {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 300;
  color: #3A3A3A;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-bottom__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.04);
}

.hero-bottom__tag {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 300;
  color: #3A3A3A;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero-copy {
    padding-right: 0;
    padding-top: 0;
    order: 2;
  }

  .hero-visual {
    height: 55vw;
    min-height: 280px;
    max-height: 420px;
    order: 1;
    transform: translateY(20px) scale(0.98);
  }

  .hero[data-mounted="true"] .hero-visual {
    transform: translateY(0) scale(1);
  }

  .hero-badge {
    left: 16px;
    bottom: 16px;
  }

  .hero-bottom {
    padding: 16px 24px;
  }

  .hero-bottom__tag {
    display: none;
  }
}
`;