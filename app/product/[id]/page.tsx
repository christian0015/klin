import { notFound } from "next/navigation";
import { products, brandConfig } from "@/lib/data";
import type { Metadata } from "next";
import ProductClient from "./ProductClient";

// ─────────────────────────────────────────────────────────────────────────────
// Static params — génère /product/1, /product/2, /product/3 au build
// ─────────────────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata dynamique par produit
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return { title: "Vetement — KLIN" };
  }

  return {
    title: `${product.name} — ${brandConfig.name}`,
    description: product.description.short,
    openGraph: {
      title: `${product.name} — ${brandConfig.name}`,
      description: product.description.long,
      images: product.media[0]
        ? [{ url: product.media[0] }]
        : [],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Server component — resolve produit + passe au client
// ─────────────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params, }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;

  const product = products.find((p) => String(p.id) === id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 2);

  return <ProductClient product={product} related={related} />;
}