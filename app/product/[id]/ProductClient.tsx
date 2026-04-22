"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { brandConfig } from "@/lib/data";
import type { Product } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CLIENT — page produit complète
// Layout : galerie gauche sticky / infos droite scroll
// Zero distraction — pas de nav inutile, focus total sur la pièce
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  product: Product;
  related: Product[];
};

export default function ProductClient({ product, related }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [descOpen, setDescOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Reset state quand le produit change
  useEffect(() => {
    setActiveImg(0);
    setSelectedSize(null);
    setDescOpen(false);
    setSizeError(false);
    setAddedToCart(false);
  }, [product.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.media[0],
      quantity: 1,
      color: product.colors?.[0] || "default"
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  };

  const whatsappMsg = encodeURIComponent(
    `Bonjour KLIN 👋\nJe souhaite commander :\n▸ ${product.name}${selectedSize ? `\n▸ Taille : ${selectedSize}` : ""}\n\nMerci !`
  );
  const whatsappUrl = `https://wa.me/${brandConfig.whatsapp.replace(/\D/g, "")}?text=${whatsappMsg}`;

  return (
    <>
      <style>{styles}</style>

      <div
        ref={rootRef}
        className={`pp ${mounted ? "pp--mounted" : ""}`}
      >
        {/* ── Breadcrumb minimal ── */}
        <nav className="pp-breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/" className="pp-breadcrumb__link">Accueil</Link>
          <span className="pp-breadcrumb__sep" aria-hidden="true">·</span>
          <span className="pp-breadcrumb__current" aria-current="page">{product.name}</span>
        </nav>

        {/* ══ SPLIT LAYOUT ════════════════════════════════════════════════ */}
        <div className="pp-split">

          {/* ── GALERIE — sticky gauche ─────────────────────────────────── */}
          <div className="pp-gallery">

            {/* Image principale */}
            <div className="pp-gallery__main">
              {/* Badge */}
              {product.badge && (
                <div className="pp-badge">{product.badge}</div>
              )}

              {/* Coins géo */}
              <span className="pp-corner pp-corner--tl" aria-hidden="true" />
              <span className="pp-corner pp-corner--tr" aria-hidden="true" />
              <span className="pp-corner pp-corner--bl" aria-hidden="true" />
              <span className="pp-corner pp-corner--br" aria-hidden="true" />

              <Image
                src={product.media[activeImg] ?? product.media[0]}
                alt={`${product.name} — vue ${activeImg + 1}`}
                fill
                priority
                className="pp-gallery__img"
                sizes="(max-width: 960px) 100vw, 55vw"
              />

              {/* Overlays */}
              <div className="pp-gallery__overlay" aria-hidden="true" />
              <div className="pp-gallery__glow" aria-hidden="true" />

              {/* Indicateur image */}
              <div className="pp-gallery__counter" aria-label={`Image ${activeImg + 1} sur ${product.media.length}`}>
                <span className="pp-gallery__counter-cur">{String(activeImg + 1).padStart(2, "0")}</span>
                <span className="pp-gallery__counter-sep">/</span>
                <span className="pp-gallery__counter-tot">{String(product.media.length).padStart(2, "0")}</span>
              </div>

              {/* Navigation flèches si plusieurs images */}
              {product.media.length > 1 && (
                <>
                  <button
                    className="pp-gallery__nav pp-gallery__nav--prev"
                    onClick={() => setActiveImg(i => (i - 1 + product.media.length) % product.media.length)}
                    aria-label="Image précédente"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    className="pp-gallery__nav pp-gallery__nav--next"
                    onClick={() => setActiveImg(i => (i + 1) % product.media.length)}
                    aria-label="Image suivante"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Miniatures */}
            {product.media.length > 1 && (
              <div className="pp-gallery__thumbs" role="list" aria-label="Vues du produit">
                {product.media.map((src, i) => (
                  <button
                    key={src}
                    className={`pp-thumb ${i === activeImg ? "pp-thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                    role="listitem"
                    aria-label={`Vue ${i + 1}`}
                    aria-pressed={i === activeImg}
                  >
                    <Image src={src} alt="" fill className="pp-thumb__img" sizes="80px" />
                    <span className="pp-thumb__overlay" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            {/* Rail vertical gauche */}
            <div className="pp-gallery__rail" aria-hidden="true">
              <span className="pp-gallery__rail-text">{product.shortDescription.toUpperCase()}</span>
              <span className="pp-gallery__rail-line" />
              <span className="pp-gallery__rail-text">KLIN·{String(product.id).padStart(2, "0")}</span>
            </div>

          </div>

          {/* ── INFOS — droite ──────────────────────────────────────────── */}
          <div className="pp-info">

            {/* ─ Identité produit ─ */}
            <div className="pp-info__head">
              <p className="pp-info__tagline">{product.shortDescription}</p>
              <h1 className="pp-info__title">{product.name}</h1>

              <div className="pp-divider" aria-hidden="true">
                <span className="pp-divider__line" />
                <span className="pp-divider__dot" />
                <span className="pp-divider__dot" />
              </div>
            </div>

            {/* ─ Prix ─ */}
            <div className="pp-price">
              {product.price > 0 ? (
                <>
                  <span className="pp-price__amount">{product.price.toLocaleString("fr-MA")} MAD</span>
                  <span className="pp-price__delivery">Paiement à la livraison</span>
                </>
              ) : (
                <>
                  <span className="pp-price__amount pp-price__amount--contact">Prix sur commande</span>
                  <span className="pp-price__delivery">Contactez-nous via WhatsApp</span>
                </>
              )}
            </div>

            {/* ─ Description ─ */}
            <div className="pp-desc">
              {/* Court — toujours visible */}
              <p className="pp-desc__short">{product.description.short}</p>

              {/* Long — toggle */}
              <div
                className="pp-desc__long"
                style={{ maxHeight: descOpen ? "300px" : "0" }}
                aria-hidden={!descOpen}
              >
                <p className="pp-desc__long-text">{product.description.long}</p>
              </div>

              <button
                className="pp-desc__toggle"
                onClick={() => setDescOpen(d => !d)}
                aria-expanded={descOpen}
              >
                <span>{descOpen ? "Moins de détails" : "Tous les détails"}</span>
                <span className={`pp-desc__toggle-icon ${descOpen ? "pp-desc__toggle-icon--open" : ""}`} aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>

            {/* ─ Couleur ─ */}
            <div className="pp-option">
              <p className="pp-option__label">Coloris</p>
              <div className="pp-colors">
                {product.colors.map(color => {
                  const bg =
                    color === "brown" ? "#7B4F2E" :
                    color === "offwhite" ? "#F5F0E8" :
                    color === "white" ? "#EFEFEF" :
                    color;
                  return (
                    <span
                      key={color}
                      className="pp-swatch"
                      style={{ background: bg }}
                      title={color}
                      aria-label={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* ─ Taille ─ */}
            <div className="pp-option">
              <div className="pp-option__header">
                <p className="pp-option__label">
                  Taille
                  {selectedSize && <span className="pp-option__selected"> — {selectedSize} sélectionné</span>}
                </p>
                <button className="pp-guide-link" aria-label="Guide des tailles">
                  Guide des tailles
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div
                className={`pp-sizes ${sizeError ? "pp-sizes--error" : ""}`}
                role="radiogroup"
                aria-label="Choisir une taille"
              >
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`pp-size ${selectedSize === size ? "pp-size--active" : ""}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    role="radio"
                    aria-checked={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {sizeError && (
                <p className="pp-size-error" role="alert" aria-live="assertive">
                  Veuillez choisir une taille avant de commander.
                </p>
              )}
            </div>

            {/* ─ CTAs ─ */}
            <div className="pp-ctas">
              {/* WhatsApp — principal */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pp-cta pp-cta--primary"
                aria-label="Commander via WhatsApp"
              >
                <span className="pp-cta__icon" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
                Commander maintenant
                <span className="pp-cta__sweep" aria-hidden="true" />
              </a>

              {/* Panier — secondaire */}
              <button
                className={`pp-cta pp-cta--ghost ${addedToCart ? "pp-cta--done" : ""}`}
                onClick={handleAddToCart}
                aria-label={addedToCart ? "Ajouté au panier" : "Ajouter au panier"}
              >
                {addedToCart ? (
                  <>
                    <span className="pp-cta__icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <span className="pp-cta__icon" aria-hidden="true">
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

            {/* ─ Infos livraison ─ */}
            <div className="pp-delivery">
              <div className="pp-delivery__item">
                <div className="pp-delivery__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="2" y="7" width="14" height="10" rx="1"/>
                    <path d="M16 10h4l2 3v4h-6V10z"/>
                    <circle cx="7" cy="19" r="1.5"/>
                    <circle cx="19" cy="19" r="1.5"/>
                  </svg>
                </div>
                <div>
                  <p className="pp-delivery__title">Livraison Casablanca</p>
                  <p className="pp-delivery__body">24–48h • Paiement à la réception</p>
                </div>
              </div>
              <div className="pp-delivery__item">
                <div className="pp-delivery__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M3 12l7 7L21 5"/>
                  </svg>
                </div>
                <div>
                  <p className="pp-delivery__title">Satisfait ou échangé</p>
                  <p className="pp-delivery__body">Retour sous 48h via WhatsApp</p>
                </div>
              </div>
              <div className="pp-delivery__item">
                <div className="pp-delivery__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="pp-delivery__title">Qualité garantie</p>
                  <p className="pp-delivery__body">Pièce inspectée avant expédition</p>
                </div>
              </div>
            </div>

            {/* ─ Référence produit ─ */}
            <div className="pp-ref" aria-label="Référence produit">
              <span className="pp-ref__label">Réf.</span>
              <span className="pp-ref__value">KLN-{String(product.id).padStart(3, "0")}</span>
              <span className="pp-ref__sep" aria-hidden="true">·</span>
              <span className={`pp-ref__status ${product.availability ? "pp-ref__status--in" : "pp-ref__status--out"}`}>
                {product.availability ? "En stock" : "Rupture de stock"}
              </span>
            </div>

          </div>
        </div>

        {/* ══ PRODUITS LIÉS ═══════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="pp-related" aria-label="Autres pièces KLIN">
            <div className="pp-related__header">
              <span className="pp-related__rule" aria-hidden="true" />
              <h2 className="pp-related__title">Aussi dans la collection</h2>
              <span className="pp-related__rule" aria-hidden="true" />
            </div>

            <div className="pp-related__grid">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={rel.link}
                  className="pp-rel-card"
                  aria-label={`Voir ${rel.name}`}
                >
                  {/* Image */}
                  <div className="pp-rel-card__img-wrap">
                    <Image
                      src={rel.media[0]}
                      alt={rel.name}
                      fill
                      className="pp-rel-card__img"
                      sizes="(max-width: 900px) 50vw, 25vw"
                    />
                    <div className="pp-rel-card__overlay" aria-hidden="true" />
                    {rel.badge && (
                      <span className="pp-rel-card__badge">{rel.badge}</span>
                    )}
                    <span className="pp-rel-corner pp-rel-corner--tl" aria-hidden="true" />
                    <span className="pp-rel-corner pp-rel-corner--br" aria-hidden="true" />
                  </div>

                  {/* Info */}
                  <div className="pp-rel-card__body">
                    <p className="pp-rel-card__tag">{rel.shortDescription}</p>
                    <p className="pp-rel-card__name">{rel.name}</p>
                    <span className="pp-rel-card__cta">
                      Voir la pièce
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Retour collection */}
            <div className="pp-back">
              <Link href="/#collectiion" className="pp-back__link">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M10 7H2M5.5 3.5L2 7l3.5 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Retour à la collection
              </Link>
            </div>
          </section>
        )}

      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = `

/* ── Root ── */
.pp {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #0B0B0B;
  overflow-x: hidden;
}

/* ── Breadcrumb ── */
.pp-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 80px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.pp--mounted .pp-breadcrumb { opacity: 1; transform: none; }

.pp-breadcrumb__link {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: #5A5A5A;
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.2s ease;
}

.pp-breadcrumb__link:hover { color: #D6C3A3; }

.pp-breadcrumb__sep {
  color: #2A2A2A;
  font-size: 0.55rem;
}

.pp-breadcrumb__current {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: #A0A0A0;
  letter-spacing: 0.05em;
}

/* ══ SPLIT ═════════════════════════════════════════════════════════════ */
.pp-split {
  display: grid;
  grid-template-columns: 55% 45%;
  min-height: calc(100vh - 61px);
}

@media (max-width: 960px) {
  .pp-split { grid-template-columns: 1fr; }
  .pp-breadcrumb { padding: 20px 24px; }
}

/* ════════════════════
   GALERIE
════════════════════ */
.pp-gallery {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 0;
  opacity: 0;
  transform: translateX(-16px);
  transition: opacity 0.9s ease 0.1s, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s;
}

.pp--mounted .pp-gallery { opacity: 1; transform: none; }

@media (max-width: 960px) {
  .pp-gallery {
    position: relative;
    height: auto;
    top: auto;
  }
}

/* Image principale */
.pp-gallery__main {
  position: relative;
  flex: 1;
  overflow: hidden;
  min-height: 60vh;
}

.pp-gallery__img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
}

.pp-gallery__main:hover .pp-gallery__img { transform: scale(1.02); }

.pp-gallery__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(11,11,11,0.12) 0%,
    transparent 30%,
    transparent 65%,
    rgba(11,11,11,0.5) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.pp-gallery__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 40% at 50% 70%, rgba(214,195,163,0.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 3;
}

/* Badge */
.pp-badge {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
  background: #D6C3A3;
  color: #0B0B0B;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.52rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 5px 12px;
}

/* Coins géo */
.pp-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: rgba(214,195,163,0.25);
  border-style: solid;
  z-index: 10;
  pointer-events: none;
  transition: border-color 0.4s ease;
}

.pp-gallery__main:hover .pp-corner { border-color: rgba(214,195,163,0.45); }

.pp-corner--tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
.pp-corner--tr { top: 16px; right: 16px; border-width: 1px 1px 0 0; }
.pp-corner--bl { bottom: 16px; left: 16px; border-width: 0 0 1px 1px; }
.pp-corner--br { bottom: 16px; right: 16px; border-width: 0 1px 1px 0; }

/* Compteur */
.pp-gallery__counter {
  position: absolute;
  bottom: 20px;
  left: 24px;
  z-index: 10;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.pp-gallery__counter-cur {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.6rem;
  font-weight: 200;
  color: rgba(255,255,255,0.5);
  line-height: 1;
}

.pp-gallery__counter-sep {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  color: #3A3A3A;
}

.pp-gallery__counter-tot {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  color: #3A3A3A;
  letter-spacing: 0.05em;
}

/* Nav flèches */
.pp-gallery__nav {
  position: absolute;
  bottom: 20px;
  z-index: 10;
  background: rgba(11,11,11,0.7);
  border: 1px solid rgba(255,255,255,0.08);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #A0A0A0;
  transition: color 0.25s ease, border-color 0.25s ease;
  backdrop-filter: blur(8px);
}

.pp-gallery__nav:hover { color: #D6C3A3; border-color: rgba(214,195,163,0.3); }

.pp-gallery__nav--prev { right: 64px; }
.pp-gallery__nav--next { right: 20px; }

/* Miniatures */
.pp-gallery__thumbs {
  display: flex;
  gap: 2px;
  background: #0B0B0B;
  padding: 8px 0 0;
  height: 88px;
  flex-shrink: 0;
}

.pp-thumb {
  position: relative;
  flex: 1;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  background: none;
  padding: 0;
  transition: border-color 0.25s ease;
}

.pp-thumb--active,
.pp-thumb:hover { border-color: rgba(214,195,163,0.5); }

.pp-thumb__img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.4s ease;
}

.pp-thumb:hover .pp-thumb__img { transform: scale(1.05); }

.pp-thumb__overlay {
  position: absolute;
  inset: 0;
  background: rgba(11,11,11,0.2);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.pp-thumb--active .pp-thumb__overlay { opacity: 0; }

/* Rail vertical */
.pp-gallery__rail {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  writing-mode: vertical-rl;
  z-index: 10;
}

.pp-gallery__rail-text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.5rem;
  font-weight: 300;
  letter-spacing: 0.22em;
  color: #2A2A2A;
  text-transform: uppercase;
  white-space: nowrap;
}

.pp-gallery__rail-line {
  display: block;
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, transparent, #2a2a2a, transparent);
}

/* ════════════════════
   INFOS
════════════════════ */
.pp-info {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 56px 64px 80px 56px;
  border-left: 1px solid rgba(255,255,255,0.04);
  opacity: 0;
  transform: translateX(16px);
  transition: opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s;
}

.pp--mounted .pp-info { opacity: 1; transform: none; }

@media (max-width: 960px) {
  .pp-info {
    padding: 40px 24px 60px;
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
}

/* Head */
.pp-info__head { display: flex; flex-direction: column; gap: 8px; }

.pp-info__tagline {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.62rem;
  font-weight: 400;
  letter-spacing: 0.28em;
  color: #D6C3A3;
  text-transform: uppercase;
}

.pp-info__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2rem, 3.5vw, 3.2rem);
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.pp-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.pp-divider__line {
  display: block;
  width: 48px;
  height: 1px;
  background: linear-gradient(90deg, #D6C3A3, transparent);
}

.pp-divider__dot {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #D6C3A3;
  opacity: 0.4;
}

/* Prix */
.pp-price {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px 0;
  border-top: 1px solid rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.pp-price__amount {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 2.4rem;
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1;
}

.pp-price__amount--contact {
  font-size: 1.6rem;
  color: #A0A0A0;
}

.pp-price__delivery {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.06em;
}

/* Description */
.pp-desc { display: flex; flex-direction: column; gap: 12px; }

.pp-desc__short {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.875rem;
  font-weight: 300;
  color: #A0A0A0;
  line-height: 1.8;
  letter-spacing: 0.02em;
}

.pp-desc__long {
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.25,0.46,0.45,0.94);
}

.pp-desc__long-text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.82rem;
  font-weight: 300;
  color: #6A6A6A;
  line-height: 1.85;
  letter-spacing: 0.02em;
  padding-top: 12px;
}

.pp-desc__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.62rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #D6C3A3;
  transition: opacity 0.25s ease;
  width: fit-content;
}

.pp-desc__toggle:hover { opacity: 0.6; }

.pp-desc__toggle-icon {
  display: flex;
  align-items: center;
  transition: transform 0.35s ease;
}

.pp-desc__toggle-icon--open { transform: rotate(180deg); }

/* Options */
.pp-option { display: flex; flex-direction: column; gap: 14px; }

.pp-option__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pp-option__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5A5A5A;
}

.pp-option__selected {
  color: #D6C3A3;
  font-style: italic;
  letter-spacing: 0.08em;
  font-size: 0.58rem;
}

.pp-guide-link {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 300;
  color: #3A3A3A;
  letter-spacing: 0.08em;
  transition: color 0.2s ease;
}

.pp-guide-link:hover { color: #D6C3A3; }

/* Couleurs */
.pp-colors { display: flex; gap: 10px; }

.pp-swatch {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pp-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(214,195,163,0.35);
}

/* Tailles */
.pp-sizes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pp-sizes--error .pp-size:not(.pp-size--active) {
  border-color: rgba(200,80,80,0.4);
}

.pp-size {
  width: 52px;
  height: 52px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: #A0A0A0;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.pp-size::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(214,195,163,0.06);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.pp-size:hover::before { opacity: 1; }
.pp-size:hover { border-color: rgba(214,195,163,0.3); color: #D6C3A3; }

.pp-size--active {
  border-color: #D6C3A3;
  background: #D6C3A3;
  color: #0B0B0B;
}

.pp-size-error {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.62rem;
  font-weight: 300;
  color: rgba(200,80,80,0.9);
  letter-spacing: 0.04em;
  animation: pp-shake 0.35s ease;
}

@keyframes pp-shake {
  0%,100% { transform: none; }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* CTAs */
.pp-ctas { display: flex; flex-direction: column; gap: 10px; }

.pp-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 18px 32px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, opacity 0.3s ease;
}

.pp-cta--primary {
  background: #D6C3A3;
  color: #0B0B0B;
}

.pp-cta__sweep {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.12);
  transform: translateX(-100%);
  transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94);
}

.pp-cta--primary:hover .pp-cta__sweep { transform: translateX(0); }
.pp-cta--primary:hover { transform: translateY(-1px); }

.pp-cta--ghost {
  background: transparent;
  color: #A0A0A0;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.25s ease;
}

.pp-cta--ghost:hover {
  border-color: rgba(214,195,163,0.35);
  color: #D6C3A3;
}

.pp-cta--done {
  background: rgba(214,195,163,0.08) !important;
  border-color: rgba(214,195,163,0.3) !important;
  color: #D6C3A3 !important;
}

.pp-cta__icon { display: flex; align-items: center; }

/* Livraison */
.pp-delivery {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.pp-delivery__item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.pp-delivery__icon {
  color: #D6C3A3;
  flex-shrink: 0;
  margin-top: 1px;
  opacity: 0.7;
}

.pp-delivery__title {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.72rem;
  font-weight: 400;
  color: #A0A0A0;
  letter-spacing: 0.03em;
  margin-bottom: 2px;
}

.pp-delivery__body {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.62rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.04em;
}

/* Référence */
.pp-ref {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.03);
}

.pp-ref__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 300;
  color: #3A3A3A;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.pp-ref__value {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 300;
  color: #5A5A5A;
  letter-spacing: 0.12em;
}

.pp-ref__sep { color: #2A2A2A; font-size: 0.5rem; }

.pp-ref__status {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 400;
  letter-spacing: 0.1em;
}

.pp-ref__status--in { color: rgba(120,180,120,0.8); }
.pp-ref__status--out { color: rgba(200,80,80,0.7); }

/* ════════════════════
   PRODUITS LIÉS
════════════════════ */
.pp-related {
  padding: 80px 80px 100px;
  background: #0B0B0B;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.pp-related__header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
}

.pp-related__rule {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.04);
}

.pp-related__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 300;
  font-style: italic;
  color: #5A5A5A;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.pp-related__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}

/* Carte liée */
.pp-rel-card {
  display: block;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.pp-rel-card__img-wrap {
  position: relative;
  height: 420px;
  overflow: hidden;
}

.pp-rel-card__img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
}

.pp-rel-card:hover .pp-rel-card__img { transform: scale(1.04); }

.pp-rel-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(11,11,11,0.7) 100%);
  pointer-events: none;
  z-index: 2;
}

.pp-rel-card__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 5;
  background: #D6C3A3;
  color: #0B0B0B;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 4px 10px;
}

.pp-rel-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: rgba(214,195,163,0.2);
  border-style: solid;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pp-rel-card:hover .pp-rel-corner { opacity: 1; }

.pp-rel-corner--tl { top: 10px; left: 10px; border-width: 1px 0 0 1px; }
.pp-rel-corner--br { bottom: 10px; right: 10px; border-width: 0 1px 1px 0; }

.pp-rel-card__body {
  padding: 20px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pp-rel-card__tag {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 300;
  color: #D6C3A3;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.pp-rel-card__name {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.15rem;
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: 0.01em;
}

.pp-rel-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #5A5A5A;
  margin-top: 4px;
  transition: color 0.25s ease;
}

.pp-rel-card:hover .pp-rel-card__cta { color: #D6C3A3; }

/* Retour */
.pp-back {
  display: flex;
  justify-content: center;
  margin-top: 64px;
}

.pp-back__link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5A5A5A;
  text-decoration: none;
  transition: color 0.25s ease;
}

.pp-back__link:hover { color: #D6C3A3; }

/* Responsive */
@media (max-width: 960px) {
  .pp-gallery__rail { display: none; }
  .pp-related { padding: 60px 24px 80px; }
  .pp-related__grid { grid-template-columns: 1fr; }
  .pp-rel-card__img-wrap { height: 320px; }
}
`;