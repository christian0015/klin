// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductDescription = {
  short: string;
  long: string;
};

export type Product = {
  id: number;
  name: string;
  shortDescription: string;
  description: ProductDescription;
  media: string[];         // images first, video last (if any)
  price: number;
  colors: string[];
  sizes: string[];
  availability: boolean;
  link: string;
  badge?: string;          // ex: "Nouveau" | "Best seller"
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: 1,
    name: "Veste cuir marron",
    shortDescription: "Raw elegance",
    description: {
      short: "Veste cuir marron minimaliste.",
      long: "Pièce premium en cuir travaillé, pensée pour un style brut et élégant au quotidien. Coupe droite, finitions soignées, matière qui gagne en caractère avec le temps.",
    },
    media: ["/products/haut-cuir-maron.jpeg"],
    price: 600,
    colors: ["brown"],
    sizes: ["S", "M", "L"],
    availability: true,
    link: "/product/1",
    badge: "Premium",
  },
  {
    id: 2,
    name: "T-shirt blanc oversize",
    shortDescription: "Pure essential",
    description: {
      short: "T-shirt oversize blanc.",
      long: "Basique essentiel avec coupe oversize pour un style minimal moderne. Coton épais, tombé parfait, polyvalent du matin au soir.",
    },
    media: ["/products/haut-tchirt-blanc.jpeg"],
    price: 200,
    colors: ["white"],
    sizes: ["S", "M", "L", "XL"],
    availability: true,
    link: "/product/2",
  },
  {
    id: 3,
    name: "Veste noire minimal",
    shortDescription: "Silent power",
    description: {
      short: "Veste noire minimaliste.",
      long: "Design épuré, silhouette forte, pensée pour un style silencieux mais puissant. Chaque détail est là pour une raison.",
    },
    media: ["/products/haut-veste001-noir.jpeg"],
    price: 600,
    colors: ["black"],
    sizes: ["S", "M", "L"],
    availability: true,
    link: "/product/3",
    badge: "Bestseller",
  },

  {
  id: 4,
  name: "Veste cuir orange",
  shortDescription: "Bold energy",
  description: {
    short: "Veste cuir orange.",
    long: "Pièce forte au caractère affirmé. Couleur audacieuse combinée à une coupe maîtrisée pour un style qui capte l’attention.",
  },
  media: ["/products/haut-cuir-orange.jpeg"],
  price: 500,
  colors: ["orange"],
  sizes: ["S", "M", "L"],
  availability: true,
  link: "/product/4",
},
{
  id: 5,
  name: "Jean marron",
  shortDescription: "Everyday structure",
  description: {
    short: "Jean marron moderne.",
    long: "Coupe pensée pour le quotidien. Structure solide et style polyvalent pour accompagner toutes les pièces du vestiaire.",
  },
  media: ["/products/bas-pentalon_jean001-maron.jpeg"],
  price: 800,
  colors: ["brown"],
  sizes: ["S", "M", "L", "XL"],
  availability: true,
  link: "/product/5",
},
{
  id: 6,
  name: "Chemise été marron",
  shortDescription: "Light motion",
  description: {
    short: "Chemise légère marron.",
    long: "Tissu respirant et coupe fluide. Idéale pour un style minimal adapté aux températures élevées.",
  },
  media: ["/products/haut-chemise_ete001-maron.jpeg"],
  price: 300,
  colors: ["brown"],
  sizes: ["S", "M", "L"],
  availability: true,
  link: "/product/6",
},
// {
//   id: 7,
//   name: "Drop Streetwear 2025",
//   shortDescription: "In motion",
//   description: {
//     short: "Collection en mouvement.",
//     long: "Présentation dynamique du drop KLIN. Une vision du style en mouvement, pensée pour le digital.",
//   },
//   media: ["/sample-5s.mp4"],
//   price: 1000,
//   colors: [],
//   sizes: [],
//   availability: true,
//   link: "/product/7",
//   badge: "Drop",
// }
];

// ─── Featured product ─────────────────────────────────────────────────────────

export const featuredProduct = products[0];

// ─── Brand config ─────────────────────────────────────────────────────────────

export const brandConfig = {
  name: "KLIN",
  tagline: "Des pièces simples. Un style maîtrisé.",
  taglineSub: "Mode minimaliste premium — Casablanca",
  whatsapp: "+212713088840",         // ← remplacer
  deliveryZone: "Casablanca",
  paymentMethod: "Paiement à la livraison",
  social: {
    tiktok: "https://www.tiktok.com/@klin",
    instagram: "https://www.instagram.com/klin",
  },
} as const;

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export type FaqItem = {
  q: string;
  a: string;
};

export const faq: FaqItem[] = [
  {
    q: "Comment commander ?",
    a: "Choisissez votre pièce, sélectionnez la taille et cliquez sur Commander. Vous serez redirigé vers WhatsApp pour confirmer.",
  },
  {
    q: "Livraison ?",
    a: "Livraison rapide sur Casablanca. Paiement à la réception, aucun pré-paiement requis.",
  },
  {
    q: "Guide des tailles ?",
    a: "Nos pièces ont une coupe standard — référez-vous à vos tailles habituelles. En cas de doute, contactez-nous.",
  },
  {
    q: "Retours ?",
    a: "Satisfait ou échangé dans les 48h suivant la livraison. Contactez-nous via WhatsApp.",
  },
];