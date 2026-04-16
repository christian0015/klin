"use client";

import { useEffect, useRef, useState } from "react";
import { brandConfig } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER — §08
// "Style du mois" — input email minimal, pas de bruit
// Fond : #0B0B0B avec grande typographie décorative en watermark
// Feedback : confirmation inline sans rechargement
// ─────────────────────────────────────────────────────────────────────────────

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const validate = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(email)) {
      setErrorMsg("Adresse email invalide.");
      setStatus("error");
      inputRef.current?.focus();
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    // Simulation — remplacer par votre appel API / Mailchimp / Klaviyo
    await new Promise(r => setTimeout(r, 900));
    setStatus("success");
  };

  return (
    <>
      <style>{styles}</style>

      <section
        ref={sectionRef}
        className={`nl ${visible ? "nl--visible" : ""}`}
        aria-label="Inscription newsletter Style du mois"
      >
        {/* ── Watermark typographique ── */}
        <div className="nl-watermark" aria-hidden="true">
          <span className="nl-watermark__text">STYLE</span>
        </div>

        {/* ── Ligne géo haute ── */}
        <div className="nl-rule nl-rule--top" aria-hidden="true">
          <span className="nl-rule__line" />
          <span className="nl-rule__diamond" />
          <span className="nl-rule__line" />
        </div>

        {/* ── Contenu principal ── */}
        <div className="nl-inner">

          {/* Header */}
          <div className="nl-header">
            <div className="nl-header__label">
              <span className="nl-label-num">08</span>
              <span className="nl-label-dash" />
              <span className="nl-label-tag">NEWSLETTER</span>
            </div>

            <h2 className="nl-header__title">
              Le style<br />du <em>mois.</em>
            </h2>

            <p className="nl-header__sub">
              Nouvelles pièces, inspirations, accès prioritaire.
              <br />
              Un email. Pas plus.
            </p>
          </div>

          {/* Formulaire / Confirmation */}
          <div className="nl-form-wrap">

            {status !== "success" ? (
              <form
                className="nl-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulaire inscription newsletter"
              >
                {/* Champ email */}
                <div className="nl-field">
                  <label htmlFor="nl-email" className="nl-field__label">
                    Votre adresse email
                  </label>

                  <div className={`nl-field__input-wrap ${status === "error" ? "nl-field__input-wrap--error" : ""}`}>
                    <input
                      ref={inputRef}
                      id="nl-email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      className="nl-field__input"
                      aria-describedby={status === "error" ? "nl-error" : undefined}
                      aria-invalid={status === "error"}
                      disabled={status === "loading"}
                      required
                    />

                    {/* Bouton intégré */}
                    <button
                      type="submit"
                      className={`nl-submit ${status === "loading" ? "nl-submit--loading" : ""}`}
                      disabled={status === "loading"}
                      aria-label="S'inscrire à la newsletter"
                    >
                      {status === "loading" ? (
                        <span className="nl-submit__loader" aria-hidden="true" />
                      ) : (
                        <>
                          <span className="nl-submit__text">S'inscrire</span>
                          <span className="nl-submit__arrow" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Message erreur */}
                  {status === "error" && (
                    <p id="nl-error" className="nl-field__error" role="alert" aria-live="assertive">
                      {errorMsg}
                    </p>
                  )}
                </div>

                {/* RGPD micro-texte */}
                <p className="nl-legal">
                  En vous inscrivant, vous acceptez de recevoir nos communications.
                  Désinscription à tout moment.
                </p>
              </form>
            ) : (
              /* ── Confirmation ── */
              <div className="nl-success" role="status" aria-live="polite">
                <div className="nl-success__icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l6 6 10-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="nl-success__title">Vous êtes inscrit.</p>
                  <p className="nl-success__body">
                    Prochain style du mois — dans votre boîte. À bientôt.
                  </p>
                </div>
              </div>
            )}

            {/* Réseaux sociaux */}
            <div className="nl-social" aria-label="Réseaux sociaux KLIN">
              <p className="nl-social__label">Suivez-nous</p>
              <div className="nl-social__links">
                <a
                  href={brandConfig.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nl-social__link"
                  aria-label="KLIN sur TikTok"
                >
                  TikTok
                </a>
                <span className="nl-social__sep" aria-hidden="true">·</span>
                <a
                  href={brandConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nl-social__link"
                  aria-label="KLIN sur Instagram"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Règle géo basse + Footer ── */}
        <div className="nl-rule nl-rule--bottom" aria-hidden="true">
          <span className="nl-rule__line" />
          <span className="nl-rule__diamond" />
          <span className="nl-rule__line" />
        </div>

        {/* Footer minimaliste */}
        <footer className="nl-footer">
          <span className="nl-footer__brand">{brandConfig.name}</span>
          <span className="nl-footer__sep">·</span>
          <span className="nl-footer__zone">{brandConfig.taglineSub}</span>
          <span className="nl-footer__sep">·</span>
          <span className="nl-footer__copy">© {new Date().getFullYear()}</span>
        </footer>

      </section>
    </>
  );
}

const styles = `
/* ── Root ── */
.nl {
  position: relative;
  width: 100%;
  background: #0B0B0B;
  padding: 120px 0 0;
  overflow: hidden;
}

/* ── Watermark ── */
.nl-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  z-index: 0;
  overflow: hidden;
}

.nl-watermark__text {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(10rem, 22vw, 22rem);
  font-weight: 200;
  color: rgba(255,255,255,0.018);
  letter-spacing: -0.04em;
  line-height: 1;
  white-space: nowrap;
  display: block;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s;
}

.nl--visible .nl-watermark__text {
  opacity: 1;
  transform: scale(1);
}

/* ── Règles géo ── */
.nl-rule {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 80px;
  margin-bottom: 64px;
  opacity: 0;
  transition: opacity 0.7s ease 0.1s;
}

.nl--visible .nl-rule { opacity: 1; }

.nl-rule--bottom {
  margin-bottom: 0;
  margin-top: 80px;
}

.nl-rule__line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.04);
}

.nl-rule__diamond {
  display: block;
  width: 6px;
  height: 6px;
  border: 1px solid rgba(214,195,163,0.3);
  transform: rotate(45deg);
}

/* ── Inner ── */
.nl-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 45% 55%;
  gap: 0;
  padding: 0 80px;
  align-items: start;
}

@media (max-width: 900px) {
  .nl-inner {
    grid-template-columns: 1fr;
    padding: 0 24px;
    gap: 48px;
  }
  .nl-rule { padding: 0 24px; }
}

/* ── Header ── */
.nl-header {
  padding-right: 60px;
  border-right: 1px solid rgba(255,255,255,0.04);
  padding-bottom: 60px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s;
}

.nl--visible .nl-header { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .nl-header {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    padding-bottom: 40px;
  }
}

.nl-header__label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.nl-label-num {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  color: #D6C3A3;
  letter-spacing: 0.1em;
}

.nl-label-dash {
  display: block;
  width: 24px;
  height: 1px;
  background: #2a2a2a;
}

.nl-label-tag {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.28em;
  color: #5A5A5A;
  text-transform: uppercase;
}

.nl-header__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: clamp(2.8rem, 5vw, 5rem);
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 24px;
}

.nl-header__title em {
  font-style: italic;
  color: #D6C3A3;
}

.nl-header__sub {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.8rem;
  font-weight: 300;
  color: #5A5A5A;
  line-height: 1.85;
  letter-spacing: 0.02em;
}

/* ── Formulaire ── */
.nl-form-wrap {
  padding-left: 64px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
}

.nl--visible .nl-form-wrap { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .nl-form-wrap { padding-left: 0; }
}

/* Field */
.nl-field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nl-field__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5A5A5A;
}

/* Input wrap */
.nl-field__input-wrap {
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.3s ease;
}

.nl-field__input-wrap:focus-within {
  border-color: rgba(214,195,163,0.4);
}

.nl-field__input-wrap--error {
  border-color: rgba(200, 80, 80, 0.5);
}

/* Input */
.nl-field__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 18px 20px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.85rem;
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: 0.02em;
}

.nl-field__input::placeholder {
  color: #3A3A3A;
  font-style: italic;
}

.nl-field__input:disabled {
  opacity: 0.4;
}

/* Submit */
.nl-submit {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  background: #D6C3A3;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  min-width: 120px;
  justify-content: center;
  transition: background 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nl-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.1);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nl-submit:hover::before { transform: translateX(0); }
.nl-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.nl-submit__text {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #0B0B0B;
}

.nl-submit__arrow {
  display: flex;
  align-items: center;
  color: #0B0B0B;
  transition: transform 0.3s ease;
}

.nl-submit:hover .nl-submit__arrow { transform: translateX(3px); }

/* Loader */
.nl-submit__loader {
  display: block;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(11,11,11,0.3);
  border-top-color: #0B0B0B;
  border-radius: 50%;
  animation: nl-spin 0.7s linear infinite;
}

@keyframes nl-spin { to { transform: rotate(360deg); } }

/* Erreur */
.nl-field__error {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 300;
  color: rgba(200,80,80,0.9);
  letter-spacing: 0.05em;
}

/* RGPD */
.nl-legal {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 300;
  color: #2A2A2A;
  line-height: 1.6;
  letter-spacing: 0.03em;
  max-width: 400px;
}

/* ── Confirmation ── */
.nl-success {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 28px;
  border: 1px solid rgba(214,195,163,0.2);
  border-left: 2px solid #D6C3A3;
  background: rgba(214,195,163,0.04);
  animation: nl-fade-in 0.5s ease forwards;
}

@keyframes nl-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}

.nl-success__icon {
  color: #D6C3A3;
  flex-shrink: 0;
  margin-top: 2px;
}

.nl-success__title {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 300;
  font-style: italic;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.nl-success__body {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.72rem;
  font-weight: 300;
  color: #5A5A5A;
  line-height: 1.6;
  letter-spacing: 0.02em;
}

/* ── Social ── */
.nl-social {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.nl-social__label {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.58rem;
  font-weight: 300;
  color: #3A3A3A;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.nl-social__links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nl-social__link {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.65rem;
  font-weight: 400;
  color: #5A5A5A;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.25s ease;
}

.nl-social__link:hover { color: #D6C3A3; }

.nl-social__sep {
  color: #2A2A2A;
  font-size: 0.6rem;
}

/* ── Footer ── */
.nl-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 80px;
  border-top: 1px solid rgba(255,255,255,0.03);
}

.nl-footer__brand {
  font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
  font-size: 0.8rem;
  font-weight: 300;
  font-style: italic;
  color: #2A2A2A;
  letter-spacing: 0.08em;
}

.nl-footer__sep {
  color: #1A1A1A;
  font-size: 0.6rem;
}

.nl-footer__zone,
.nl-footer__copy {
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 0.55rem;
  font-weight: 300;
  color: #1E1E1E;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

@media (max-width: 900px) {
  .nl-footer {
    flex-direction: column;
    gap: 6px;
    padding: 20px 24px;
    text-align: center;
  }
  .nl-footer__sep { display: none; }
}
`;
