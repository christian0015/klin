import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// NOT FOUND — /product/[id] introuvable
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductNotFound() {
  return (
    <>
      <style>{`
        .nf {
          min-height: 100vh;
          background: #0B0B0B;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 40px;
          text-align: center;
        }
        .nf__num {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(6rem, 20vw, 14rem);
          font-weight: 200;
          color: rgba(255,255,255,0.04);
          line-height: 1;
          letter-spacing: -0.04em;
          user-select: none;
        }
        .nf__title {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          font-weight: 300;
          font-style: italic;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        .nf__sub {
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 0.8rem;
          font-weight: 300;
          color: #5A5A5A;
          letter-spacing: 0.04em;
          max-width: 320px;
        }
        .nf__line {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 120px;
        }
        .nf__line span:first-child,
        .nf__line span:last-child {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
          display: block;
        }
        .nf__dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #D6C3A3;
          display: block;
          opacity: 0.5;
        }
        .nf__cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 36px;
          background: #D6C3A3;
          color: #0B0B0B;
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity 0.25s ease;
        }
        .nf__cta:hover { opacity: 0.85; }
      `}</style>

      <div className="nf">
        <span className="nf__num" aria-hidden="true">404</span>
        <h1 className="nf__title">Cette pièce n'existe pas.</h1>
        <div className="nf__line" aria-hidden="true">
          <span /><span className="nf__dot" /><span />
        </div>
        <p className="nf__sub">
          Le produit que vous cherchez a peut-être été retiré ou n'est plus disponible.
        </p>
        <Link href="/" className="nf__cta">
          Retour à la collection
        </Link>
      </div>
    </>
  );
}