"use client";

import { useEffect, useRef, useState } from "react";
import { faq } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// FAQ MINI — §07
// Accordéon éditorial — une seule ouverte à la fois
// Fond : #111111 — intermédiaire entre le blanc Trust et le noir pur
// Typographie : questions en serif, réponses en sans
// ─────────────────────────────────────────────────────────────────────────────

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i);

  return (
    <>
      <style>{styles}</style>

      <section
        ref={sectionRef}
        className={`fq ${visible ? "fq--visible" : ""}`}
        aria-label="Questions fréquentes"
      >
        {/* ── Layout split ── */}
        <div className="fq-inner">

          {/* ── Colonne gauche — header fixe ── */}
          <div className="fq-aside">
            <div className="fq-aside__label">
              <span className="fq-aside__num">07</span>
              <span className="fq-aside__dash" />
              <span className="fq-aside__tag">FAQ</span>
            </div>

            <h2 className="fq-aside__title">
              Vous avez<br /><em>des questions.</em>
            </h2>

            <p className="fq-aside__sub">
              Les réponses essentielles,<br />sans détour.
            </p>

            {/* Décoration géo */}
            <div className="fq-aside__geo" aria-hidden="true">
              <span className="fq-aside__geo-line" />
              <span className="fq-aside__geo-square" />
            </div>

            {/* Compteur */}
            <div className="fq-aside__count" aria-hidden="true">
              <span className="fq-aside__count-current">
                {open !== null ? `0${open + 1}` : "—"}
              </span>
              <span className="fq-aside__count-sep">/</span>
              <span className="fq-aside__count-total">0{faq.length}</span>
            </div>
          </div>

          {/* ── Colonne droite — accordéon ── */}
          <div className="fq-list" role="list">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={`fq-item ${isOpen ? "fq-item--open" : ""}`}
                  role="listitem"
                  style={{ "--fq-index": i } as React.CSSProperties}
                >
                  <button
                    className="fq-item__trigger"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`fq-answer-${i}`}
                    id={`fq-question-${i}`}
                  >
                    {/* Numéro */}
                    <span className="fq-item__index" aria-hidden="true">
                      0{i + 1}
                    </span>

                    {/* Question */}
                    <span className="fq-item__question">{item.q}</span>

                    {/* Icône +/− */}
                    <span className="fq-item__icon" aria-hidden="true">
                      <span className="fq-item__icon-h" />
                      <span className="fq-item__icon-v" />
                    </span>
                  </button>

                  {/* Réponse */}
                  <div
                    id={`fq-answer-${i}`}
                    className="fq-item__answer"
                    role="region"
                    aria-labelledby={`fq-question-${i}`}
                    style={{
                      maxHeight: isOpen ? "200px" : "0",
                    }}
                  >
                    <p className="fq-item__answer-text">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── Bande de séparation ── */}
        <div className="fq-bottom" aria-hidden="true">
          <span className="fq-bottom__line" />
          <span className="fq-bottom__text">KLIN — CASABLANCA · MAROC</span>
          <span className="fq-bottom__line" />
        </div>

      </section>
    </>
  );
}

const styles = `
/* ── Root ── */
.fq {
  position: relative;
  width: 100%;
  background: #111111;
  padding: 100px 0 0;
  overflow: hidden;
}

/* ── Inner split ── */
.fq-inner {
  display: grid;
  grid-template-columns: 38% 62%;
  gap: 0;
  padding: 0 80px;
}

@media (max-width: 900px) {
  .fq-inner {
    grid-template-columns: 1fr;
    padding: 0 24px;
    gap: 48px;
  }
}

/* ── Aside ── */
.fq-aside {
  padding-right: 64px;
  padding-bottom: 80px;
  border-right: 1px solid rgba(255,255,255,0.04);
  display: flex;
  flex-direction: column;
  gap: 0;
  opacity: 0;
  transform: translateX(-16px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fq--visible .fq-aside { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .fq-aside {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    padding-bottom: 40px;
  }
}

.fq-aside__label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.fq-aside__num {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  color: #D6C3A3;
  letter-spacing: 0.1em;
}

.fq-aside__dash {
  display: block;
  width: 24px;
  height: 1px;
  background: #2a2a2a;
}

.fq-aside__tag {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.28em;
  color: #5A5A5A;
  text-transform: uppercase;
}

.fq-aside__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 20px;
}

.fq-aside__title em {
  font-style: italic;
  color: #D6C3A3;
}

.fq-aside__sub {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.75rem;
  font-weight: 300;
  color: #5A5A5A;
  line-height: 1.7;
  letter-spacing: 0.02em;
  margin-bottom: 40px;
}

/* Géo déco */
.fq-aside__geo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.fq-aside__geo-line {
  display: block;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, #D6C3A3, transparent);
}

.fq-aside__geo-square {
  display: block;
  width: 5px;
  height: 5px;
  border: 1px solid rgba(214,195,163,0.4);
  transform: rotate(45deg);
}

/* Compteur */
.fq-aside__count {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: auto;
}

.fq-aside__count-current {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 3rem;
  font-weight: 200;
  color: rgba(255,255,255,0.12);
  line-height: 1;
  transition: color 0.4s ease;
  letter-spacing: -0.02em;
}

.fq--visible .fq-aside__count-current {
  color: rgba(214,195,163,0.2);
}

.fq-aside__count-sep {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  color: #3A3A3A;
}

.fq-aside__count-total {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.7rem;
  color: #3A3A3A;
  letter-spacing: 0.05em;
}

/* ── Liste accordéon ── */
.fq-list {
  padding-left: 64px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 900px) {
  .fq-list { padding-left: 0; }
}

/* Item */
.fq-item {
  border-bottom: 1px solid rgba(255,255,255,0.05);
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--fq-index, 0) * 0.1s + 0.15s);
}

.fq--visible .fq-item { opacity: 1; transform: none; }

.fq-item:first-child { border-top: 1px solid rgba(255,255,255,0.05); }

/* Trigger */
.fq-item__trigger {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 28px 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.fq-item__trigger:hover .fq-item__question {
  color: #FFFFFF;
}

/* Numéro */
.fq-item__index {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 300;
  color: #D6C3A3;
  letter-spacing: 0.1em;
  flex-shrink: 0;
  width: 20px;
  transition: opacity 0.3s ease;
}

.fq-item:not(.fq-item--open) .fq-item__index {
  opacity: 0.4;
}

/* Question */
.fq-item__question {
  flex: 1;
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  font-weight: 300;
  color: #A0A0A0;
  letter-spacing: 0.01em;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.fq-item--open .fq-item__question {
  color: #FFFFFF;
  font-style: italic;
}

/* Icône +/− */
.fq-item__icon {
  position: relative;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.fq-item__icon-h,
.fq-item__icon-v {
  position: absolute;
  background: #D6C3A3;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s ease;
}

.fq-item__icon-h {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  transform: translateY(-50%);
}

.fq-item__icon-v {
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  transform: translateX(-50%);
}

.fq-item--open .fq-item__icon-v {
  transform: translateX(-50%) rotate(90deg);
  opacity: 0;
}

/* Réponse */
.fq-item__answer {
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fq-item__answer-text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.82rem;
  font-weight: 300;
  color: #6A6A6A;
  line-height: 1.85;
  letter-spacing: 0.02em;
  padding: 0 36px 28px 40px;
}

/* ── Bande basse ── */
.fq-bottom {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 80px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.fq-bottom__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.03);
}

.fq-bottom__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 300;
  color: #2A2A2A;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

@media (max-width: 900px) {
  .fq-bottom { padding: 20px 24px; }
}
`;
