import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef()
  const r1  = useRef()
  const r2  = useRef()
  const r3  = useRef()

  useEffect(() => {
    const onMove = e => {
      const t = `translate(${e.clientX}px,${e.clientY}px)`
      if (dot.current) dot.current.style.transform = t
      if (r1.current)  r1.current.style.transform  = t
      if (r2.current)  r2.current.style.transform  = t
      if (r3.current)  r3.current.style.transform  = t
    }

    const onEnter = () => dot.current?.classList.add('hov')
    const onLeave = () => dot.current?.classList.remove('hov')

    const addListeners = () => {
      document.querySelectorAll('button, a, input, textarea, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    addListeners()

    const obs = new MutationObserver(addListeners)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <style>{`
        .cur-dot {
          position: fixed; top: 0; left: 0;
          width: 7px; height: 7px;
          margin: -3.5px 0 0 -3.5px;
          border-radius: 50%;
          background: var(--biolume);
          box-shadow: 0 0 10px var(--biolume), 0 0 22px rgba(56,201,232,.5);
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
          transition: width .15s, height .15s, margin .15s, background .15s;
        }
        .cur-dot.hov {
          width: 11px; height: 11px;
          margin: -5.5px 0 0 -5.5px;
          background: #fff;
          box-shadow: 0 0 14px rgba(255,255,255,.6);
        }

        .sonar {
          position: fixed; top: 0; left: 0;
          border-radius: 50%;
          border: 1px solid rgba(56,201,232,.7);
          pointer-events: none;
          z-index: 9997;
          will-change: transform;
          animation: sonar-ping 2.4s ease-out infinite;
          opacity: 0;
        }
        .sonar.d1 { animation-delay: 0s;   }
        .sonar.d2 { animation-delay: .8s;  }
        .sonar.d3 { animation-delay: 1.6s; }

        @keyframes sonar-ping {
          0%   { width:7px;  height:7px;  margin:-3.5px 0 0 -3.5px; opacity:.75; border-color:rgba(56,201,232,.75); }
          100% { width:72px; height:72px; margin:-36px  0 0 -36px;  opacity:0;   border-color:rgba(56,201,232,0);   }
        }
      `}</style>

      <div ref={dot} className="cur-dot" />
      <div ref={r1}  className="sonar d1" />
      <div ref={r2}  className="sonar d2" />
      <div ref={r3}  className="sonar d3" />
    </>
  )
}