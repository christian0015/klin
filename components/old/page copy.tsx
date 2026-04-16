import Image from "next/image";
import DDD from "./page3"
import Caroussel from "./Caroussel"
// description ici est utilise seulement pour le caroulle, mais dans la page dediée du produit on doit avoir info qui est une description plus large et complet, pourquoi pas meme en sous json, avec couleur/taille et disponibilité ?
const products = [
  {
    url: "/products/haut-cuir-maron.jpeg",
    name: "Veste cuir marron",
    description: "Raw elegance",
    link: "/product/1"
  },
  {
    url: "/products/haut-tchirt-blanc.jpeg",
    name: "T-shirt blanc oversize",
    description: "Pure essential",
    link: "/product/1"
  },
  {
    url: "/products/haut-veste001-noir.jpeg",
    name: "Veste noire minimal",
    description: "Silent power",
    link: "/product/1"
  },
  {
    url: "/products/haut-cuir-orange.jpeg",
    name: "Veste cuir orange",
    description: "Bold energy",
    link: "/product/1"
  },
  {
    url: "/products/bas-pentalon_jean001-maron.jpeg",
    name: "Jean marron",
    description: "Everyday structure",
    link: "/product/1"
  },
  {
    url: "/products/haut-chemise_ete001-maron.jpeg",
    name: "Chemise été marron",
    description: "Light motion",
    link: "/product/1"
  },

  {
    url: "/sample-5s.mp4",
    name: "Drop Streetwear 2025",
    description: "Collection exclusive en mouvement.",
    link: "/product/2"
  }
]
export default function Home() {
  return (
    <>
        {/* <DDD/> */}
        
        <Caroussel list={products} /> {/* Carousel peut etre utiliser pour la collection */}
        </>
  );
}
