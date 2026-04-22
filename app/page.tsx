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

import Song      from "@/components/song";

export const metadata: Metadata = {
  title: "KLIN — Des pièces simples. Un style maîtrisé.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "KLIN",
    description: "No noise. Just presence.",
    url: "https://klin-official.vercel.app/",
    siteName: "KLIN",
    images: [
      {
        url: "/og-image.png",
        width: 1254,
        height: 1254,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "KLIN",
    description: "No noise. Just presence.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <main className="grain">
      <Song/>
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