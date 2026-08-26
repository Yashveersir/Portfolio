// HeroBg — subtle static fallback while Hero3D canvas loads
// Rendered as a CSS-only element, zero JS overhead

export default function HeroBg() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 55% 45%, rgba(34,211,238,0.03) 0%, transparent 70%),
          radial-gradient(ellipse 60% 50% at 20% 70%, rgba(124,111,255,0.025) 0%, transparent 65%),
          #05070B
        `,
      }}
    />
  );
}
