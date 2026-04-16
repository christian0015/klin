"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import App from "./ui/Caroussel/Caroussel" 
import { products } from "@/lib/data"

gsap.registerPlugin(ScrollTrigger)

export default function CollectionSection({ list = products }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Crée le flux de scroll lié au carrousel
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",      // L'ancrage commence dès que le haut touche le haut
        end: "+=2000",         // Distance de scroll pour parcourir tout le carrousel
        pin: true,             // Bloque la section pendant le défilement
        scrub: 0.1,            // Fluidifie le mouvement (0.1 pour un petit effet d'inertie)
        onUpdate: (self) => {
          const p = self.progress
          setProgress(p)
          
          // On envoie la progression au Canvas
          window.dispatchEvent(
            new CustomEvent("carousel-scroll", { detail: p })
          )
        }
      }
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  const progressPercent = Math.round(progress * 100)

  return (
    <div
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* On passe la progression directement si tu veux éviter CustomEvent, 
          mais CustomEvent est plus sûr pour ne pas surcharger le bridge React-Three */}
      <App list={list} />

      {/* HEADER (REMIS AVEC TES TEXTES) */}
      <div style={uiOverlayStyles}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", color: "#D6C3A3" }}>04</span>
          <span style={{ width: "30px", height: "1px", background: "#333" }} />
          <span style={{ fontSize: "10px", color: "#555" }}>COLLECTION</span>
        </div>

        <h2 style={{ fontSize: "32px", color: "white", fontWeight: 300 }}>
          Nos <em style={{ color: "#D6C3A3" }}>pièces.</em>
        </h2>

        {/* Progress */}
        <div style={{ textAlign: "right" }}>
          <div style={progressBarContainer}>
            <div style={{ ...progressBarFill, width: `${progressPercent}%` }} />
          </div>

          <span style={{ fontSize: "10px", color: "#555" }}>
            {String(Math.round(progress * (list.length || 1))).padStart(2, "0")}{" "}
            / {String(list.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}

// STYLES 
const uiOverlayStyles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  padding: "2rem 80px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  pointerEvents: "none",
  zIndex: 10,
}

const progressBarContainer: React.CSSProperties = {
  width: "120px",
  height: "1px",
  background: "#222",
  marginBottom: "6px",
}

const progressBarFill: React.CSSProperties = {
  height: "100%",
  background: "#D6C3A3",
  transition: "width 0.1s ease-out",
}