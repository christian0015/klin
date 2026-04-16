"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { featuredProduct, brandConfig } from "@/lib/data";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED PRODUCT
// Layout : full-bleed asymétrique — image gauche (60%) / infos droite (40%)
// Details : sélecteur taille, galerie miniatures, CTA WhatsApp + panier
// Vibe : éditorial premium, respiration maximale, géométrie fine
// ─────────────────────────────────────────────────────────────────────────────

export default function FeaturedProduct() {
  const rootRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<tring | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [descMode, setDescMode] = useState<"short" | "long">("short");
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const product = featuredProduct;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.media[0],
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const whatsappUrl = `https://wa.me/${brandConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Bonjour, je souhaite commander : ${product.name}${selectedSize ? ` — Taille ${selectedSize}` : ""}`
  )}`;

  return (
    <>
      <style>{styles}</style>

      <section
        ref={rootRef}
        id="featured"
        className={`fp ${mounted ? "fp--mounted" : ""}`}
        aria-label={`Produit vedette — ${product.name}`}
      >
        {/* ── Label section éditorial ─── */}
        <div className="fp-section-label" aria-hidden="true">
          <span className="fp-section-label__num">02</span>
          <span className="fp-section-label__dash" />
          <span className="fp-section-label__text">PIÈCE VEDETTE</span>
        </div>

        {/* ══ SPLIT LAYOUT ════════════════════════════════════════════════ */}
        <div className="fp-inner">

          {/* ── Côté image ──────────────────────────────────────────────── */}
          <div className="fp-media">

            {/* Badge produit coin supérieur */}
            {product.badge && (
              <div className="fp-media__badge" aria-label={product.badge}>
                {product.badge}
              </div>
            )}

            {/* Image principale */}
            <div className="fp-img-main">
              <Image
                src={product.media[activeImg] ?? product.media[0]}
                alt={product.name}
                fill
                priority
                className="fp-img-main__img"
                sizes="(max-width: 900px) 100vw, 60vw"
              />
              {/* Gradient de fond */}
              <div className="fp-img-main__grad" aria-hidden="true" />
              {/* Glow discret */}
              <div className="fp-img-main__glow" aria-hidden="true" />
              {/* Coins géométriques */}
              <span className="fp-corner fp-corner--tl" aria-hidden="true" />
              <span className="fp-corner fp-corner--br" aria-hidden="true" />
            </div>

            {/* Galerie miniatures — si plusieurs images */}
            {product.media.length > 1 && (
              <div className="fp-thumbs" role="list" aria-label="Images du produit">
                {product.media.map((src, i) => (
                  <button
                    key={src}
                    className={`fp-thumb ${i === activeImg ? "fp-thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Vue ${i + 1}`}
                    role="listitem"
                  >
                    <Image
                      src={src}
                      alt={`${product.name} vue ${i + 1}`}
                      fill
                      className="fp-thumb__img"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Rail texte vertical côté image */}
            <div className="fp-media-rail" aria-hidden="true">
              <span className="fp-media-rail__text">{product.shortDescription.toUpperCase()}</span>
              <span className="fp-media-rail__line" />
              <span className="fp-media-rail__text">N°0{product.id}</span>
            </div>

          </div>

          {/* ── Côté infos ──────────────────────────────────────────────── */}
          <div className="fp-info">

            {/* En-tête produit */}
            <div className="fp-info__head">
              <p className="fp-info__tagline">{product.shortDescription}</p>
              <h2 className="fp-info__title">{product.name}</h2>

              {/* Ligne décorative */}
              <div className="fp-info__divider" aria-hidden="true">
                <span className="fp-info__divider-line" />
                <span className="fp-info__divider-dot" />
              </div>
            </div>

            {/* Description toggle court / long */}
            <div className="fp-desc">
              <p className="fp-desc__text">
                {descMode === "short"
                  ? product.description.short
                  : product.description.long}
              </p>
              <button
                className="fp-desc__toggle"
                onClick={() => setDescMode(d => d === "short" ? "long" : "short")}
                aria-expanded={descMode === "long"}
              >
                {descMode === "short" ? "Lire plus" : "Réduire"}
                <span className="fp-desc__toggle-icon" aria-hidden="true">
                  {descMode === "short" ? "↓" : "↑"}
                </span>
              </button>
            </div>

            {/* Couleur disponible */}
            <div className="fp-colors">
              <p className="fp-label">Coloris</p>
              <div className="fp-colors__swatches">
                {product.colors.map(color => (
                  <span
                    key={color}
                    className="fp-swatch"
                    style={{ background: color === "brown" ? "#7B4F2E" : color === "offwhite" ? "#F5F0E8" : color }}
                    title={color}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>

            {/* Sélecteur de taille */}
            <div className="fp-sizes">
              <p className="fp-label">
                Taille
                {selectedSize && (
                  <span className="fp-label__selected">— {selectedSize}</span>
                )}
              </p>
              <div className="fp-sizes__grid" role="radiogroup" aria-label="Sélectionner une taille">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`fp-size-btn ${selectedSize === size ? "fp-size-btn--active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                    role="radio"
                    aria-checked={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="fp-sizes__hint" aria-live="polite">Choisissez une taille pour commander</p>
              )}
            </div>

            {/* Prix et paiement */}
            <div className="fp-price-block">
              <div className="fp-price">
                {product.price > 0
                  ? <span className="fp-price__amount">{product.price} MAD</span>
                  : <span className="fp-price__amount fp-price__amount--contact">Sur devis</span>
                }
              </div>
              {/* Trust badges */}
              <div className="fp-trust-badges">
                <span className="fp-trust-badge">
                  <span className="fp-trust-badge__icon" aria-hidden="true">✓</span>
                  Paiement à la livraison
                </span>
                <span className="fp-trust-badge">
                  <span className="fp-trust-badge__icon" aria-hidden="true">✓</span>
                  Livraison Casablanca
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="fp-ctas">
              {/* WhatsApp — CTA principal */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fp-cta fp-cta--primary"
                aria-label={`Commander ${product.name} via WhatsApp`}
              >
                <span className="fp-cta__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
                Commander maintenant
              </a>

              {/* Ajouter au panier — secondaire */}
              <button
                className={`fp-cta fp-cta--ghost ${!selectedSize ? "fp-cta--disabled" : ""} ${addedToCart ? "fp-cta--added" : ""}`}
                onClick={handleAddToCart}
                disabled={!selectedSize}
                aria-label={addedToCart ? "Ajouté au panier" : "Ajouter au panier"}
              >
                {addedToCart ? (
                  <>
                    <span className="fp-cta__icon" aria-hidden="true">✓</span>
                    Ajouté
                  </>
                ) : (
                  <>
                    <span className="fp-cta__icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    </span>
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>

            {/* Infos livraison détaillées */}
            <div className="fp-delivery">
              <div className="fp-delivery__row">
                <span className="fp-delivery__icon" aria-hidden="true">◎</span>
                <span className="fp-delivery__text">Livraison rapide sur Casablanca — aucun prépaiement</span>
              </div>
              <div className="fp-delivery__row">
                <span className="fp-delivery__icon" aria-hidden="true">◎</span>
                <span className="fp-delivery__text">Satisfait ou échangé sous 48h</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bande basse éditorial ── */}
        <div className="fp-bottom" aria-hidden="true">
          <span className="fp-bottom__text">KLIN — SÉLECTION PREMIUM</span>
          <span className="fp-bottom__line" />
          <span className="fp-bottom__text">CASABLANCA · MAROC</span>
          <span className="fp-bottom__line" />
          <span className="fp-bottom__text">PAIEMENT À LA LIVRAISON</span>
        </div>

      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = `

/* ── Root ── */
.fp {
  position: relative;
  width: 100%;
  background: #0B0B0B;
  overflow: hidden;
  padding-top: 80px;
}

/* ── Label section ── */
.fp-section-label {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 80px;
  margin-bottom: 56px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
}

.fp--mounted .fp-section-label {
  opacity: 1;
  transform: none;
}

.fp-section-label__num {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 300;
  color: #D6C3A3;
  letter-spacing: 0.1em;
}

.fp-section-label__dash {
  display: block;
  width: 32px;
  height: 1px;
  background: #2a2a2a;
}

.fp-section-label__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  color: #5A5A5A;
  text-transform: uppercase;
}

/* ── Grid principal ── */
.fp-inner {
  display: grid;
  grid-template-columns: 58% 42%;
  min-height: 90vh;
}

@media (max-width: 960px) {
  .fp-inner {
    grid-template-columns: 1fr;
  }
}

/* ─────────────────────────────
   MEDIA — côté gauche
───────────────────────────── */
.fp-media {
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
}

.fp--mounted .fp-media {
  opacity: 1;
  transform: none;
}

/* Badge */
.fp-media__badge {
  position: absolute;
  top: 32px;
  left: 32px;
  z-index: 10;
  background: #D6C3A3;
  color: #0B0B0B;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 6px 14px;
}

/* Image principale */
.fp-img-main {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow: hidden;
}

.fp-img-main__img {
  object-fit: cover;
  object-position: center top;
  transition: transform 10s ease;
  transform: scale(1.04);
}

.fp--mounted .fp-img-main__img {
  transform: scale(1);
}

.fp-img-main__grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    transparent 70%,
    rgba(11,11,11,0.8) 100%
  ),
  linear-gradient(
    to bottom,
    rgba(11,11,11,0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(11,11,11,0.4) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.fp-img-main__glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: radial-gradient(
    ellipse 60% 60% at 50% 100%,
    rgba(214, 195, 163, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 3;
}

/* Coins géo */
.fp-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(214, 195, 163, 0.35);
  border-style: solid;
  z-index: 10;
  pointer-events: none;
}

.fp-corner--tl {
  top: 24px;
  left: 24px;
  border-width: 1px 0 0 1px;
}

.fp-corner--br {
  bottom: 24px;
  right: 24px;
  border-width: 0 1px 1px 0;
}

/* Miniatures */
.fp-thumbs {
  position: absolute;
  bottom: 32px;
  left: 32px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.fp-thumb {
  position: relative;
  width: 56px;
  height: 72px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  background: none;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.25s ease;
}

.fp-thumb--active,
.fp-thumb:hover {
  border-color: rgba(214, 195, 163, 0.7);
}

.fp-thumb__img {
  object-fit: cover;
  object-position: center top;
}

/* Rail texte vertical */
.fp-media-rail {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 10;
  writing-mode: vertical-rl;
}

.fp-media-rail__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  color: #3A3A3A;
  text-transform: uppercase;
  white-space: nowrap;
}

.fp-media-rail__line {
  display: block;
  width: 1px;
  height: 36px;
  background: linear-gradient(to bottom, transparent, #2a2a2a, transparent);
}

/* ─────────────────────────────
   INFO — côté droit
───────────────────────────── */
.fp-info {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding: 64px 64px 64px 56px;
  border-left: 1px solid rgba(255,255,255,0.04);
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.9s ease 0.35s, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.35s;
}

.fp--mounted .fp-info {
  opacity: 1;
  transform: none;
}

@media (max-width: 960px) {
  .fp-info {
    padding: 48px 24px;
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
}

/* En-tête */
.fp-info__head {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fp-info__tagline {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  color: #D6C3A3;
  text-transform: uppercase;
}

.fp-info__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.fp-info__divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.fp-info__divider-line {
  display: block;
  width: 48px;
  height: 1px;
  background: linear-gradient(90deg, #D6C3A3, transparent);
}

.fp-info__divider-dot {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #D6C3A3;
  opacity: 0.4;
}

/* Description */
.fp-desc {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fp-desc__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.875rem;
  font-weight: 300;
  color: #A0A0A0;
  line-height: 1.8;
  letter-spacing: 0.02em;
  transition: color 0.3s ease;
}

.fp-desc__toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #D6C3A3;
  transition: opacity 0.25s ease;
}

.fp-desc__toggle:hover {
  opacity: 0.7;
}

.fp-desc__toggle-icon {
  display: inline-block;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

/* Label générique */
.fp-label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  color: #5A5A5A;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.fp-label__selected {
  color: #D6C3A3;
  letter-spacing: 0.1em;
  font-style: italic;
}

/* Couleurs */
.fp-colors__swatches {
  display: flex;
  gap: 10px;
}

.fp-swatch {
  display: block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fp-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(214, 195, 163, 0.4);
}

/* Tailles */
.fp-sizes__grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fp-size-btn {
  width: 48px;
  height: 48px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: #A0A0A0;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.fp-size-btn:hover {
  border-color: rgba(214, 195, 163, 0.4);
  color: #D6C3A3;
}

.fp-size-btn--active {
  border-color: #D6C3A3;
  color: #0B0B0B;
  background: #D6C3A3;
}

.fp-sizes__hint {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 300;
  color: #3A3A3A;
  letter-spacing: 0.05em;
  margin-top: 8px;
  font-style: italic;
}

/* Prix */
.fp-price-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.fp-price__amount {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 2rem;
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

.fp-price__amount--contact {
  font-size: 1.4rem;
  color: #A0A0A0;
  font-style: italic;
}

/* Trust badges */
.fp-trust-badges {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fp-trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.08em;
}

.fp-trust-badge__icon {
  color: #D6C3A3;
  font-size: 0.7rem;
}

/* CTAs */
.fp-ctas {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fp-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px 32px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease, opacity 0.3s ease;
  position: relative;
  overflow: hidden;
}

.fp-cta--primary {
  background: #D6C3A3;
  color: #0B0B0B;
}

.fp-cta--primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.1);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fp-cta--primary:hover::before {
  transform: translateX(0);
}

.fp-cta--primary:hover {
  transform: translateY(-1px);
}

.fp-cta--ghost {
  background: transparent;
  color: #A0A0A0;
  border: 1px solid rgba(255,255,255,0.1);
}

.fp-cta--ghost:hover:not(.fp-cta--disabled) {
  border-color: rgba(214, 195, 163, 0.4);
  color: #D6C3A3;
}

.fp-cta--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.fp-cta--added {
  background: rgba(214, 195, 163, 0.12) !important;
  border-color: rgba(214, 195, 163, 0.35) !important;
  color: #D6C3A3 !important;
}

.fp-cta__icon {
  display: flex;
  align-items: center;
}

/* Livraison */
.fp-delivery {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fp-delivery__row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.fp-delivery__icon {
  color: #D6C3A3;
  font-size: 0.6rem;
  margin-top: 1px;
  opacity: 0.6;
  flex-shrink: 0;
}

.fp-delivery__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.05em;
  line-height: 1.6;
}

/* ── Bande basse ── */
.fp-bottom {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 80px;
  border-top: 1px solid rgba(255,255,255,0.04);
  margin-top: 48px;
  opacity: 0;
  transition: opacity 0.8s ease 0.8s;
}

.fp--mounted .fp-bottom {
  opacity: 1;
}

.fp-bottom__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 300;
  color: #2A2A2A;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  white-space: nowrap;
}

.fp-bottom__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.03);
}

@media (max-width: 960px) {
  .fp-section-label {
    padding: 0 24px;
    margin-bottom: 32px;
  }

  .fp-bottom {
    padding: 16px 24px;
  }

  .fp-bottom__text:nth-child(3),
  .fp-bottom__line:nth-child(4),
  .fp-bottom__text:nth-child(5) {
    display: none;
  }
}
`;