/**
 * KLIN — Page principale
 * ──────────────────────
 * Shell de la homepage. Chaque section est un composant indépendant.
 * Les composants seront ajoutés un par un (Hero, FeaturedProduct, etc.)
 */

import type { Metadata } from "next";

// ── Sections (décommenter au fur et à mesure de la construction) ──────────────
import Hero            from "@/components/Hero";
import FeaturedProduct from "@/components/FeaturedProduct";
import StyleSection    from "@/components/StyleSection";
import CollectionSection    from "@/components/CollectionSection";
import ContentSection  from "@/components/ContentSection";
import TrustSection    from "@/components/TrustSection";
import FAQ             from "@/components/FAQ";
import Newsletter      from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "KLIN — Des pièces simples. Un style maîtrisé.",
};

export default function HomePage() {
  return (
    <main className="grain">
      {/* ── Hero ────────────────────────────────── */}
      <Hero />

      {/* ── Featured Product ─────────────────────── */}
      <FeaturedProduct />

      {/* ── Style Section ────────────────────────── */}
      <StyleSection />

      {/* ── Style Section ────────────────────────── */}
      <CollectionSection />

      {/* ── Content (lifestyle videos) ───────────── */}
      <ContentSection />

      {/* ── Trust ────────────────────────────────── */}
      <TrustSection />

      {/* ── FAQ ──────────────────────────────────── */}
      <FAQ />

      {/* ── Newsletter ───────────────────────────── */}
      <Newsletter />

      {/* ── Placeholder until components are built ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            letterSpacing: "0.25em",
            color: "var(--text-primary)",
          }}
        >
          KLIN
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
          }}
        >
          {/* Initialisation — en construction */}
          Luxe — Silencieux
        </span>
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "var(--accent)",
            marginTop: "1rem",
          }}
        />
      </section>
    </main>
  );
}