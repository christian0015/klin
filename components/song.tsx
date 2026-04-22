"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AudioPref = "yes" | "no";

// ─── Headphone SVG ────────────────────────────────────────────────────────────

function HeadphoneIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transition: "opacity 0.4s ease",
        opacity: active ? 1 : 0.45,
      }}
    >
      <path
        d="M3 18v-6a9 9 0 0 1 18 0v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Wave bars animation ──────────────────────────────────────────────────────

function WaveBars() {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "2px",
        height: "12px",
        marginLeft: "6px",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: "2px",
            borderRadius: "1px",
            background: "currentColor",
            animationName: "klin-wave",
            animationDuration: `${0.6 + i * 0.15}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationDelay: `${i * 0.1}s`,
            height: `${6 + i * 2}px`,
          }}
        />
      ))}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function MoodModal({
  onChoice,
}: {
  onChoice: (choice: AudioPref) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay mount → fade-in after page settle
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#0c0c0c",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "52px 44px 44px",
          maxWidth: 360,
          width: "90%",
          textAlign: "center",
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
        }}
      >
        {/* Accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 40,
            height: 1,
            background: "rgba(255,255,255,0.3)",
          }}
        />

        {/* Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            margin: "0 auto 24px",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <HeadphoneIcon active={true} />
        </div>

        {/* Heading */}
        <p
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "1.25rem",
            fontWeight: 400,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.06em",
            margin: "0 0 10px",
            textTransform: "uppercase",
          }}
        >
          Set the mood
        </p>

        {/* Sub */}
        <p
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            margin: "0 0 36px",
            lineHeight: 1.7,
          }}
        >
          Activer l'ambiance sonore
          <br />
          pour une expérience complète
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => onChoice("yes")}
            style={{
              flex: 1,
              padding: "13px 0",
              background: "white",
              color: "#0c0c0c",
              border: "none",
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Activer
          </button>
          <button
            onClick={() => onChoice("no")}
            style={{
              flex: 1,
              padding: "13px 0",
              background: "transparent",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            Non merci
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Song() {
  const [pref, setPref] = useState<AudioPref | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);

  // sessionStorage key = one per calendar day
  const todayKey = `klin-audio-${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    const stored = sessionStorage.getItem(todayKey) as AudioPref | null;
    if (stored) {
      setPref(stored);
      setPlaying(stored === "yes");
      setBtnVisible(true);
    } else {
      // Show popup after page settles
      const t = setTimeout(() => {
        setShowModal(true);
        setBtnVisible(true);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [todayKey]);

  const handleChoice = useCallback(
    (choice: AudioPref) => {
      sessionStorage.setItem(todayKey, choice);
      setPref(choice);
      setShowModal(false);
      setPlaying(choice === "yes");
    },
    [todayKey]
  );

  const toggle = () => {
    if (pref === null) {
      setShowModal(true);
      return;
    }
    setPlaying((p) => !p);
  };

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes klin-wave {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
        @keyframes klin-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Mood modal */}
      {showModal && <MoodModal onChoice={handleChoice} />}

      {/* Toggle pill — fixed top-left */}
      <button
        onClick={toggle}
        title={playing ? "Couper l'ambiance" : "Activer l'ambiance"}
        aria-label={playing ? "Couper la musique" : "Activer la musique"}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          padding: playing ? "9px 14px 9px 12px" : "9px 12px",
          gap: 0,
          background: playing
            ? "rgba(255,255,255,0.06)"
            : "transparent",
          border: `1px solid ${playing ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 0,
          color: "white",
          cursor: "pointer",
          transition:
            "background 0.4s ease, border-color 0.4s ease, padding 0.3s ease, opacity 0.4s ease",
          opacity: btnVisible ? 1 : 0,
          animationName: btnVisible ? "klin-fade-in" : "none",
          animationDuration: "0.6s",
          animationFillMode: "both",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
        onMouseEnter={(e) => {
          if (!playing) {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          }
        }}
        onMouseLeave={(e) => {
          if (!playing) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }
        }}
      >
        <HeadphoneIcon active={playing} />
        {playing && <WaveBars />}
      </button>

      {/* Hidden audio via YouTube embed */}
      {playing && (
        <iframe
          width="0"
          height="0"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            opacity: 0,
            pointerEvents: "none",
            border: "none",
          }}
          src="https://www.youtube.com/embed/rC4F-Wwrr5E?start=2225&autoplay=1&loop=1&playlist=rC4F-Wwrr5E"
          allow="autoplay"
          title="KLIN ambient sound"
        />
      )}
    </>
  );
}