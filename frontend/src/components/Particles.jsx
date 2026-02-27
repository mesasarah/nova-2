import { useMemo } from 'react'

export default function Particles() {
  const particles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + .8,
    left: Math.random() * 100,
    duration: 14 + Math.random() * 18,
    delay: Math.random() * -28,
  })), [])

  return (
    <>
      <style>{`
        @keyframes pf {
          0%   { transform: translateY(100vh) scale(0);   opacity: 0; }
          8%   { opacity: .4; }
          90%  { opacity: .1; }
          100% { transform: translateY(-10vh) translateX(20px) scale(1.2); opacity: 0; }
        }
        .par {
          position: absolute;
          border-radius: 50%;
          background: var(--biolume);
          opacity: 0;
          animation: pf linear infinite;
          will-change: transform, opacity;
        }
      `}</style>
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none', overflow:'hidden' }}>
        {particles.map(p => (
          <div key={p.id} className="par" style={{
            width:  p.size,
            height: p.size,
            left:   `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }} />
        ))}
      </div>
    </>
  )
}