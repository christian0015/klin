"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Caroussel from "./ui/Caroussel/Caroussel"
import { products } from "@/lib/data"
import { collectionScrollStore } from "./collectionScrollStore"

gsap.registerPlugin(ScrollTrigger)

export default function CollectionSection({ list = products }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scrollLength = list.length * 600 // ~600px par item

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollLength}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.6, // inertie douce
      onUpdate: (self) => {
        // Injection directe dans le store — zéro re-render, zéro latence
        collectionScrollStore.offset = self.progress
        setProgress(self.progress) // uniquement pour la progress bar UI
      },
    })

    return () => {
      trigger.kill()
    }
  }, [list.length])

  const progressPercent = Math.round(progress * 100)

  return (
    <div
      ref={sectionRef}
        id="collection"
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <Caroussel list={list} />

      <div style={uiOverlayStyles}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", color: "#D6C3A3" }}>04</span>
          <span style={{ width: "30px", height: "1px", background: "#333" }} />
          <span style={{ fontSize: "10px", color: "#555" }}>COLLECTION</span>
        </div>

        <h2 style={{ fontSize: "32px", color: "white", fontWeight: 300 }}>
          Nos <em style={{ color: "#D6C3A3" }}>pièces.</em>
        </h2>

        <div style={{ textAlign: "right" }}>
          <div style={progressBarContainer}>
            <div style={{ ...progressBarFill, width: `${progressPercent}%` }} />
          </div>
          <span style={{ fontSize: "10px", color: "#555" }}>
            {String(Math.round(progress * (list.length - 1)) + 1).padStart(2, "0")}
            {" / "}
            {String(list.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}

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