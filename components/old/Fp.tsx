"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProduct, brandConfig } from "@/lib/data";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED PRODUCT
// Layout : visuel gauche pleine hauteur / fiche produit droite
// Vibe   : showroom luxury · breathing space · éditorial
// ─────────────────────────────────────────────────────────────────────────────

export default function FeaturedProduct() {
  const product = featuredProduct;
  const { addToCart, toggleCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-cycle images (si plusieurs médias)
  const allMedia = product.media;

  function handleAddToCart() {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 1200); return; }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: product.colors[0],
      quantity: 1,
      image: allMedia[0],
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); toggleCart(); }, 900);
  }

  function handleWhatsApp() {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 1200); return; }
    const text = encodeURIComponent(
      `Bonjour, je souhaite commander :\n*${product.name}*\nTaille : ${selectedSize}\nCouleur : ${product.colors[0]}\n\nMerci !`
    );
    window.open(`https://wa.me/${brandConfig.whatsapp.replace(/\D/g, "")}?text=${text}`, "_blank");
  }

  return (
    <>
      <style>{styles}</style>

      <section
        id="featured"
        ref={sectionRef}
        className={`fp${visible ? " fp--visible" : ""}`}
        aria-label={`Produit vedette — ${product.name}`}
      >

        {/* ── Étiquette section ────────────────────────────────────────── */}
        <div className="fp-eyebrow" aria-hidden="true">
          <span className="fp-eyebrow__line" />
          <span className="fp-eyebrow__text">PIÈCE SÉLECTIONNÉE</span>
          <span className="fp-eyebrow__line" />
        </div>

        {/* ── Titre de section — grand editorial ───────────────────────── */}
        <div className="fp-heading" aria-hidden="true">
          <span className="fp-heading__word">LA</span>
          <span className="fp-heading__accent">PIÈCE</span>
        </div>

        {/* ── Corps principal ───────────────────────────────────────────── */}
        <div className="fp-body">

          {/* ══ VISUEL ══════════════════════════════════════════════════ */}
          <div className="fp-visual">

            {/* Numéro éditorial flottant */}
            <span className="fp-visual__index" aria-hidden="true">
              0{product.id}
            </span>

            {/* Image principale */}
            <div className="fp-img-main">
              <div className="fp-img-main__inner">
                {allMedia.map((src, i) => (
                  <div
                    key={src}
                    className={`fp-img-slide${i === activeImg ? " fp-img-slide--active" : ""}`}
                  >
                    <Image
                      src={src}
                      alt={i === 0 ? product.name : `${product.name} — vue ${i + 1}`}
                      fill
                      priority={i === 0}
                      className="fp-img"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}

                {/* Overlay gradient */}
                <div className="fp-img-main__overlay" aria-hidden="true" />

                {/* Glow produit */}
                <div className="fp-img-main__glow" aria-hidden="true" />

                {/* Coins géo */}
                <span className="fp-corner fp-corner--tl" aria-hidden="true" />
                <span className="fp-corner fp-corner--br" aria-hidden="true" />
              </div>
            </div>

            {/* Thumbnails — navigation images */}
            {allMedia.length > 1 && (
              <div className="fp-thumbs" role="tablist" aria-label="Vues du produit">
                {allMedia.map((src, i) => (
                  <button
                    key={src}
                    role="tab"
                    aria-selected={i === activeImg}
                    aria-label={`Vue ${i + 1}`}
                    className={`fp-thumb${i === activeImg ? " fp-thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <Image src={src} alt="" fill sizes="64px" className="fp-thumb__img" />
                  </button>
                ))}
              </div>
            )}

            {/* Dot si une seule image */}
            {allMedia.length === 1 && (
              <div className="fp-single-dot" aria-hidden="true">
                <span />
              </div>
            )}
          </div>

          {/* ══ FICHE PRODUIT ════════════════════════════════════════════ */}
          <div className="fp-card">

            {/* Badge */}
            {product.badge && (
              <span className="fp-badge">{product.badge}</span>
            )}

            {/* Catégorie */}
            <p className="fp-cat">
              <span className="fp-cat__dash" />
              Vêtements — Collection
            </p>

            {/* Nom produit */}
            <h2 className="fp-name">{product.name}</h2>

            {/* Court tagline */}
            <p className="fp-tag">{product.shortDescription}</p>

            {/* Prix */}
            <div className="fp-price-row">
              <span className="fp-price">
                {product.price > 0 ? `${product.price} MAD` : "Prix sur commande"}
              </span>
              <span className="fp-price-note">Paiement à la livraison</span>
            </div>

            {/* Séparateur */}
            <div className="fp-sep" aria-hidden="true">
              <span className="fp-sep__line" />
            </div>

            {/* Description courte */}
            <p className="fp-desc-short">{product.description.short}</p>

            {/* Description longue — accordéon */}
            <details className="fp-desc-long">
              <summary className="fp-desc-long__toggle">
                <span>Description complète</span>
                <span className="fp-desc-long__icon" aria-hidden="true">+</span>
              </summary>
              <p className="fp-desc-long__body">{product.description.long}</p>
            </details>

            {/* Séparateur */}
            <div className="fp-sep" aria-hidden="true">
              <span className="fp-sep__line" />
            </div>

            {/* Sélecteur taille */}
            <div className="fp-sizes">
              <div className="fp-sizes__header">
                <span className="fp-sizes__label">TAILLE</span>
                {selectedSize && (
                  <span className="fp-sizes__selected">{selectedSize}</span>
                )}
              </div>
              <div
                className={`fp-sizes__grid${sizeError ? " fp-sizes__grid--error" : ""}`}
                role="radiogroup"
                aria-label="Sélectionner une taille"
              >
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    role="radio"
                    aria-checked={selectedSize === sz}
                    className={`fp-size-btn${selectedSize === sz ? " fp-size-btn--active" : ""}`}
                    onClick={() => { setSelectedSize(sz); setSizeError(false); }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="fp-sizes__error" role="alert">
                  Veuillez sélectionner une taille
                </p>
              )}
            </div>

            {/* Couleur */}
            <div className="fp-colors">
              <span className="fp-colors__label">COULEUR</span>
              <div className="fp-colors__swatches">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="fp-color-swatch fp-color-swatch--active"
                    style={{ background: colorMap[c] ?? c }}
                    title={c}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            {/* Séparateur */}
            <div className="fp-sep" aria-hidden="true">
              <span className="fp-sep__line" />
            </div>

            {/* CTAs */}
            <div className="fp-actions">
              {/* Bouton panier */}
              <button
                className={`fp-cta fp-cta--primary${added ? " fp-cta--added" : ""}`}
                onClick={handleAddToCart}
                aria-label="Ajouter au panier"
              >
                <span className="fp-cta__text">
                  {added ? "Ajouté ✓" : "Ajouter au panier"}
                </span>
                {!added && (
                  <span className="fp-cta__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 1h2.5l1.7 7.5h7.3l1.5-5.5H4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7" cy="13.5" r="1" fill="currentColor"/>
                      <circle cx="12" cy="13.5" r="1" fill="currentColor"/>
                    </svg>
                  </span>
                )}
              </button>

              {/* Commander via WhatsApp */}
              <button
                className="fp-cta fp-cta--whatsapp"
                onClick={handleWhatsApp}
                aria-label="Commander via WhatsApp"
              >
                <span className="fp-cta__text">Commander via WhatsApp</span>
                <span className="fp-cta__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5a6.5 6.5 0 0 1 5.63 9.77L15 14.5l-3.27-1.36A6.5 6.5 0 1 1 8 1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
                    <path d="M5.5 7.5c.5 1 1.5 2 2.5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>

              {/* Voir page produit */}
              <Link href={product.link} className="fp-cta fp-cta--ghost">
                <span className="fp-cta__text">Voir la page produit</span>
                <span className="fp-cta__icon" aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="fp-trust">
              {[
                { icon: "◈", label: "Paiement à la livraison" },
                { icon: "◎", label: `Livraison ${brandConfig.deliveryZone}` },
                { icon: "◇", label: "Pièces sélectionnées" },
              ].map(({ icon, label }) => (
                <div key={label} className="fp-trust-item">
                  <span className="fp-trust-item__icon">{icon}</span>
                  <span className="fp-trust-item__label">{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Texte décoratif en arrière-plan ──────────────────────────── */}
        <p className="fp-bg-text" aria-hidden="true">KLIN</p>

      </section>
    </>
  );
}

// ─── Couleur map ──────────────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  brown:  "#6B4C3B",
  white:  "#F5F5F5",
  black:  "#111111",
  beige:  "#D6C3A3",
  navy:   "#1A2744",
  grey:   "#7A7A7A",
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = `

/* ── Root ── */
.fp {
  position: relative;
  background: #0B0B0B;
  padding: 120px 80px;
  overflow: hidden;
}

@media (max-width: 900px) {
  .fp { padding: 80px 24px; }
}

/* ── Eyebrow ── */
.fp-eyebrow {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
}
.fp--visible .fp-eyebrow { opacity: 1; transform: none; }

.fp-eyebrow__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.05);
}
.fp-eyebrow__line:first-child { max-width: 60px; }

.fp-eyebrow__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  color: #3A3A3A;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Heading éditorial ── */
.fp-heading {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin-bottom: 64px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}
.fp--visible .fp-heading { opacity: 1; transform: none; }

.fp-heading__word {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-weight: 300;
  color: #3A3A3A;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  align-self: flex-end;
  padding-bottom: 0.2em;
}

.fp-heading__accent {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(4rem, 9vw, 8rem);
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  line-height: 0.9;
  letter-spacing: -0.02em;
}

/* ── Corps (grid) ── */
.fp-body {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 80px;
  align-items: start;
}

@media (max-width: 900px) {
  .fp-body { grid-template-columns: 1fr; gap: 48px; }
}

/* ══ VISUEL ══ */
.fp-visual {
  position: relative;
  opacity: 0;
  transform: translateX(-24px);
  transition: opacity 1s ease 0.3s, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s;
}
.fp--visible .fp-visual { opacity: 1; transform: none; }

.fp-visual__index {
  position: absolute;
  top: -24px;
  left: -16px;
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 7rem;
  font-weight: 300;
  color: rgba(255,255,255,0.025);
  line-height: 1;
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.fp-img-main {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
}

.fp-img-main__inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fp-img-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.7s ease;
}
.fp-img-slide--active { opacity: 1; }

.fp-img {
  object-fit: cover;
  object-position: center top;
  transition: transform 6s ease;
}

.fp-img-main:hover .fp-img { transform: scale(1.03); }

.fp-img-main__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(11,11,11,0.55) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.fp-img-main__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 50% at 50% 70%,
    rgba(214,195,163,0.07) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.fp-img-main:hover .fp-img-main__glow { opacity: 1; }

/* Coins géo */
.fp-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(214,195,163,0.35);
  border-style: solid;
  z-index: 10;
}
.fp-corner--tl { top: -6px; left: -6px; border-width: 1px 0 0 1px; }
.fp-corner--br { bottom: -6px; right: -6px; border-width: 0 1px 1px 0; }

/* Thumbs */
.fp-thumbs {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.fp-thumb {
  position: relative;
  width: 60px;
  height: 75px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  cursor: pointer;
  transition: border-color 0.3s ease;
  flex-shrink: 0;
  background: none;
  padding: 0;
}
.fp-thumb--active { border-color: var(--accent, #D6C3A3); }
.fp-thumb:hover { border-color: rgba(214,195,163,0.4); }

.fp-thumb__img { object-fit: cover; }

.fp-single-dot {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}
.fp-single-dot span {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent, #D6C3A3);
  opacity: 0.5;
}

/* ══ FICHE PRODUIT ══ */
.fp-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  opacity: 0;
  transform: translateX(24px);
  transition: opacity 1s ease 0.5s, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s;
  padding-top: 8px;
}
.fp--visible .fp-card { opacity: 1; transform: none; }

/* Badge */
.fp-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--accent, #D6C3A3);
  color: #0B0B0B;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 20px;
  width: fit-content;
}

/* Catégorie */
.fp-cat {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #5A5A5A;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.fp-cat__dash {
  display: block;
  width: 20px;
  height: 1px;
  background: #3A3A3A;
}

/* Nom */
.fp-name {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2.4rem, 4vw, 3.5rem);
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}

/* Tagline */
.fp-tag {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  font-weight: 300;
  color: var(--accent, #D6C3A3);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

/* Prix */
.fp-price-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 28px;
}

.fp-price {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 2rem;
  font-weight: 400;
  color: #FFFFFF;
  letter-spacing: -0.01em;
}

.fp-price-note {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Séparateur */
.fp-sep { margin: 24px 0; }
.fp-sep__line {
  display: block;
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.05);
}

/* Description courte */
.fp-desc-short {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.85rem;
  font-weight: 300;
  color: #A0A0A0;
  line-height: 1.7;
  margin-bottom: 12px;
}

/* Description longue — accordéon */
.fp-desc-long {
  margin-bottom: 4px;
}

.fp-desc-long__toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  list-style: none;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  color: #5A5A5A;
  text-transform: uppercase;
  padding: 8px 0;
  transition: color 0.3s ease;
}
.fp-desc-long__toggle::-webkit-details-marker { display: none; }
.fp-desc-long__toggle:hover { color: #A0A0A0; }

.fp-desc-long__icon {
  font-size: 1rem;
  color: var(--accent, #D6C3A3);
  transition: transform 0.3s ease;
  font-weight: 300;
}
.fp-desc-long[open] .fp-desc-long__icon { transform: rotate(45deg); }

.fp-desc-long__body {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.82rem;
  font-weight: 300;
  color: #7A7A7A;
  line-height: 1.8;
  padding: 12px 0 4px;
}

/* ── Tailles ── */
.fp-sizes { margin-bottom: 24px; }

.fp-sizes__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.fp-sizes__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #5A5A5A;
  text-transform: uppercase;
}

.fp-sizes__selected {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--accent, #D6C3A3);
  text-transform: uppercase;
}

.fp-sizes__grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  transition: outline 0.3s ease;
}

.fp-sizes__grid--error .fp-size-btn {
  border-color: rgba(200, 80, 80, 0.4) !important;
  animation: shake 0.35s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-4px); }
  75%       { transform: translateX(4px); }
}

.fp-sizes__error {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  color: rgba(200, 80, 80, 0.8);
  letter-spacing: 0.08em;
  margin-top: 8px;
}

.fp-size-btn {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: #7A7A7A;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
}
.fp-size-btn:hover {
  border-color: rgba(214,195,163,0.3);
  color: #D6C3A3;
}
.fp-size-btn--active {
  border-color: var(--accent, #D6C3A3);
  color: var(--accent, #D6C3A3);
  background: rgba(214,195,163,0.05);
}

/* ── Couleurs ── */
.fp-colors {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.fp-colors__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #5A5A5A;
  text-transform: uppercase;
}

.fp-colors__swatches { display: flex; gap: 8px; }

.fp-color-swatch {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s ease;
  position: relative;
}
.fp-color-swatch--active { border-color: var(--accent, #D6C3A3); }
.fp-color-swatch--active::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(214,195,163,0.3);
}

/* ── CTAs ── */
.fp-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
}

.fp-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease, border-color 0.3s ease;
}

.fp-cta__text { flex: 1; text-align: left; }
.fp-cta__icon { display: flex; align-items: center; flex-shrink: 0; }

/* Primaire */
.fp-cta--primary {
  background: var(--accent, #D6C3A3);
  color: #0B0B0B;
}
.fp-cta--primary:hover { background: #C4B08F; transform: translateY(-1px); }
.fp-cta--added { background: #2a3a2a; color: #8abf8a; pointer-events: none; }

/* WhatsApp */
.fp-cta--whatsapp {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: #A0A0A0;
}
.fp-cta--whatsapp:hover { border-color: rgba(214,195,163,0.3); color: #D6C3A3; }

/* Ghost */
.fp-cta--ghost {
  background: transparent;
  border: none;
  color: #5A5A5A;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.fp-cta--ghost:hover { color: #A0A0A0; border-bottom-color: rgba(255,255,255,0.1); }

/* ── Trust ── */
.fp-trust {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
}

.fp-trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fp-trust-item__icon {
  font-size: 0.7rem;
  color: var(--accent, #D6C3A3);
  opacity: 0.7;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.fp-trust-item__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.62rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── Texte décoratif BG ── */
.fp-bg-text {
  position: absolute;
  bottom: -40px;
  right: -20px;
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(8rem, 20vw, 18rem);
  font-weight: 300;
  font-style: italic;
  color: rgba(255,255,255,0.012);
  letter-spacing: 0.1em;
  pointer-events: none;
  user-select: none;
  line-height: 1;
  z-index: 0;
}
`;