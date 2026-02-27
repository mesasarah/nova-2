import { useEffect, useRef } from 'react'
import { useStore } from '../lib/store'

const VARIANTS = {
  bioluminescence: { a:[56,201,232],  b:[0,119,182]  },
  coral:           { a:[255,143,171], b:[201,24,74]   },
  sandy:           { a:[255,210,122], b:[232,160,69]  },
}

export default function OceanCanvas() {
  const ref = useRef()
  const variant = useStore(s => s.oceanVariant)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    let W, H, t = 0, raf
    const v = VARIANTS[variant] || VARIANTS.bioluminescence
    const [r,g,b]   = v.a
    const [r2,g2,b2] = v.b

    // Large slow breathing orbs
    const orbs = [
      { x:.50, y:.36, R:340, spd:.16, ph:0.0  },
      { x:.18, y:.62, R:230, spd:.11, ph:2.1  },
      { x:.83, y:.54, R:270, spd:.14, ph:4.2  },
      { x:.50, y:.88, R:400, spd:.09, ph:1.05 },
    ]

    // Thin futuristic horizon lines
    const lines = Array.from({length:5}, (_,i) => ({
      y: .44 + i*.09, al: .02 - i*.002, spd: .005+i*.002, ph: i*.9,
    }))

    // 3 ultra-slow wave layers
    const waves = [
      { a:20, f:.0068, s:.0020, y:.53, al:.052 },
      { a:13, f:.0110, s:.0014, y:.63, al:.036 },
      { a:28, f:.0048, s:.0011, y:.75, al:.026 },
    ]

    const rc = (rr,gg,bb,aa) => `rgba(${rr},${gg},${bb},${aa})`

    function resize(){ W = cv.width = window.innerWidth; H = cv.height = window.innerHeight }

    function draw(){
      ctx.clearRect(0,0,W,H)

      // Deep base gradient
      const bg = ctx.createLinearGradient(0,0,0,H)
      bg.addColorStop(0,  '#010a14')
      bg.addColorStop(.5, '#03101e')
      bg.addColorStop(1,  '#020810')
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H)

      // Breathing orbs — soul of the scene
      orbs.forEach(o => {
        const breath = Math.sin(t*o.spd + o.ph)
        const R   = o.R + breath*36
        const al  = .030 + breath*.011
        const ox  = W*o.x + Math.sin(t*o.spd*.38 + o.ph)*16
        const oy  = H*o.y + Math.cos(t*o.spd*.28 + o.ph)*10
        const rg  = ctx.createRadialGradient(ox,oy,0, ox,oy,R)
        rg.addColorStop(0,   rc(r,g,b, al))
        rg.addColorStop(.5,  rc(r,g,b, al*.3))
        rg.addColorStop(1,   'transparent')
        ctx.fillStyle = rg; ctx.fillRect(0,0,W,H)
      })

      // Horizon band
      const hy = H*.47
      const hg = ctx.createLinearGradient(0, hy-100, 0, hy+100)
      hg.addColorStop(0,  'transparent')
      hg.addColorStop(.5, rc(r,g,b, .016 + Math.sin(t*.07)*.005))
      hg.addColorStop(1,  'transparent')
      ctx.fillStyle = hg; ctx.fillRect(0, hy-100, W, 200)

      // Futuristic thin grid lines
      lines.forEach(l => {
        const yp  = H*l.y + Math.sin(t*l.spd + l.ph)*5
        const pls = Math.sin(t*l.spd*1.7 + l.ph)*.5+.5
        const lg  = ctx.createLinearGradient(0,0,W,0)
        lg.addColorStop(0,   'transparent')
        lg.addColorStop(.12, rc(r,g,b, l.al*pls))
        lg.addColorStop(.5,  rc(r,g,b, l.al*1.5*pls))
        lg.addColorStop(.88, rc(r,g,b, l.al*pls))
        lg.addColorStop(1,   'transparent')
        ctx.fillStyle = lg; ctx.fillRect(0, yp, W, .75)
      })

      // Wave layers
      waves.forEach(w => {
        ctx.beginPath()
        const by = H*w.y
        ctx.moveTo(0, by)
        for(let x=0; x<=W; x+=6){
          const y = by
            + Math.sin(x*w.f + t*w.s*1000)*w.a
            + Math.cos(x*w.f*1.38 + t*w.s*700)*(w.a*.3)
          ctx.lineTo(x,y)
        }
        ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath()
        ctx.fillStyle = rc(r,g,b,w.al); ctx.fill()

        // Crest glow line
        ctx.beginPath(); ctx.moveTo(0,by)
        for(let x=0; x<=W; x+=6){
          const y = by + Math.sin(x*w.f+t*w.s*1000)*w.a + Math.cos(x*w.f*1.38+t*w.s*700)*(w.a*.3)
          ctx.lineTo(x,y)
        }
        ctx.strokeStyle = rc(r,g,b, w.al*1.8)
        ctx.lineWidth = .7; ctx.stroke()
      })

      // Edge vignette
      const vig = ctx.createRadialGradient(W*.5,H*.5,H*.12,W*.5,H*.5,H*.82)
      vig.addColorStop(0,'transparent')
      vig.addColorStop(1,'rgba(0,4,10,.75)')
      ctx.fillStyle = vig; ctx.fillRect(0,0,W,H)
    }

    function loop(ts){ t=ts*.001; draw(); raf=requestAnimationFrame(loop) }
    resize(); window.addEventListener('resize',resize)
    raf = requestAnimationFrame(loop)
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  }, [variant])

  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,width:'100%',height:'100%'}} />
}