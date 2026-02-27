export default function NovaSigil({ size = 90 }) {
  return (
    <>
      <style>{`
        .sigil-ring{animation:sigil-rot 14s linear infinite;transform-origin:${size/2}px ${size/2}px;}
        .sigil-core{animation:sigil-pulse 3.2s ease-in-out infinite;}
        @keyframes sigil-rot{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes sigil-pulse{0%,100%{opacity:.6;}50%{opacity:1;}}
      `}</style>
      <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
        <circle cx="45" cy="45" r="43" stroke="rgba(56,201,232,.11)" strokeWidth="1"/>
        <g className="sigil-ring">
          <circle cx="45" cy="2"  r="2.5" fill="rgba(56,201,232,.5)"/>
          <circle cx="88" cy="45" r="1.5" fill="rgba(56,201,232,.28)"/>
          <circle cx="45" cy="88" r="2"   fill="rgba(56,201,232,.35)"/>
          <circle cx="2"  cy="45" r="1.5" fill="rgba(56,201,232,.28)"/>
          <path d="M45 2 L88 45 L45 88 L2 45 Z" stroke="rgba(56,201,232,.09)" strokeWidth="1" fill="none"/>
        </g>
        <circle cx="45" cy="45" r="30" stroke="rgba(56,201,232,.07)" strokeWidth="1" fill="rgba(11,29,46,.35)"/>
        <path d="M30 45 Q37.5 29 45 45 Q52.5 61 60 45" stroke="rgba(56,201,232,.62)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <path d="M32 51 Q39 38 45 51 Q51 64 58 51"    stroke="rgba(56,201,232,.24)" strokeWidth="1"   fill="none" strokeLinecap="round"/>
        <circle className="sigil-core" cx="45" cy="45" r="14" fill="rgba(56,201,232,.05)" stroke="rgba(56,201,232,.22)" strokeWidth="1"/>
        <circle cx="45" cy="45" r="4.5" fill="rgba(56,201,232,.7)"/>
        <circle cx="45" cy="45" r="2"   fill="rgba(140,228,245,.95)"/>
      </svg>
    </>
  )
}
