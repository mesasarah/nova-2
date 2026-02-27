import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import NovaSigil from '../components/NovaSigil'

const fu = (delay=0) => ({
  initial:{ opacity:0, y:36 },
  animate:{ opacity:1, y:0 },
  transition:{ duration:.9, ease:[.22,1,.36,1], delay }
})

/* Twinkling stars background */
function StarField() {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    if(!el) return
    const stars = Array.from({length:70}, (_,i) => {
      const s = document.createElement('div')
      const sz = Math.random()*1.8+.4
      s.style.cssText = `
        position:absolute;border-radius:50%;background:#fff;
        width:${sz}px;height:${sz}px;
        left:${Math.random()*100}%;top:${Math.random()*80}%;
        opacity:0;animation:star-tw ${2+Math.random()*4}s ease-in-out ${Math.random()*-6}s infinite;
      `
      return s
    })
    stars.forEach(s => el.appendChild(s))
    return () => stars.forEach(s => s.remove())
  }, [])

  return (
    <>
      <style>{`
        @keyframes star-tw {
          0%,100%{ opacity:0; transform:scale(1); }
          50%    { opacity:.65; transform:scale(1.3); }
        }
      `}</style>
      <div ref={ref} style={{position:'fixed',inset:0,zIndex:2,pointerEvents:'none',overflow:'hidden'}} />
    </>
  )
}

/* Each NOVA letter waves */
function WaveNova() {
  const letters = ['N','o','v','a']
  return (
    <>
      <style>{`
        @keyframes lw {
          0%,100%{ transform:translateY(0);    color:#38c9e8; text-shadow:none; }
          30%    { transform:translateY(-14px); color:#90e0ef; text-shadow:0 0 22px rgba(56,201,232,.65); }
          60%    { transform:translateY(4px);   color:#38c9e8; text-shadow:none; }
        }
        .nl {
          display:inline-block;
          font-style:italic;
          color:var(--biolume);
          animation:lw 2.8s ease-in-out infinite;
        }
        .nl:nth-child(1){ animation-delay:0s;   }
        .nl:nth-child(2){ animation-delay:.18s; }
        .nl:nth-child(3){ animation-delay:.36s; }
        .nl:nth-child(4){ animation-delay:.54s; }
      `}</style>
      <span>
        {letters.map((l,i) => <span key={i} className="nl">{l}</span>)}
      </span>
    </>
  )
}

export default function Landing() {
  const nav = useNavigate()

  return (
    <>
      <StarField />

      <div style={{position:'relative',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',textAlign:'center',padding:'40px 28px'}}>

        <motion.div {...fu(0)} style={{marginBottom:34}}>
          <NovaSigil size={90} />
        </motion.div>

        <motion.p {...fu(.25)} style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:5,color:'var(--biolume)',textTransform:'uppercase',marginBottom:16}}>
          Your Calm Companion
        </motion.p>

        <motion.h1 {...fu(.4)} style={{fontSize:'clamp(52px,8vw,94px)',fontWeight:300,lineHeight:1.02,letterSpacing:'-2px',color:'var(--white)',marginBottom:14}}>
          Meet <WaveNova />
        </motion.h1>

        <motion.p {...fu(.55)} style={{fontSize:18,fontWeight:300,color:'var(--text-dim)',lineHeight:1.85,fontStyle:'italic',maxWidth:480,marginBottom:50}}>
          Not a chatbot. Not a script.<br/>
          A presence that listens without judgment.
        </motion.p>

        <motion.div {...fu(.7)} style={{display:'flex',alignItems:'center',gap:14,marginBottom:50}}>
          {[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:'50%',background:'var(--muted)'}}/>)}
        </motion.div>

        <motion.button
          {...fu(.85)}
          onClick={() => nav('/chat')}
          whileHover={{ scale:1.03 }}
          whileTap={{ scale:.97 }}
          style={{
            display:'inline-flex',alignItems:'center',gap:13,
            padding:'17px 44px',background:'transparent',
            border:'1px solid rgba(56,201,232,.32)',borderRadius:60,
            color:'var(--light)',fontFamily:'var(--font-serif)',
            fontSize:18,fontWeight:300,letterSpacing:1,
            transition:'border-color .35s,color .35s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(56,201,232,.8)'; e.currentTarget.style.color='var(--glow)' }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(56,201,232,.32)'; e.currentTarget.style.color='var(--light)' }}
        >
          <PulseDot />
          Begin your session
        </motion.button>

        <motion.p
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4,duration:1}}
          style={{position:'fixed',bottom:28,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3,textTransform:'uppercase'}}
        >
          NOVA — FREE AI COMPANION — ALWAYS PRESENT
        </motion.p>

      </div>
    </>
  )
}

function PulseDot() {
  return (
    <>
      <style>{`.pd{width:8px;height:8px;border-radius:50%;background:var(--biolume);animation:pd 2s ease-in-out infinite;}@keyframes pd{0%,100%{opacity:1;}50%{opacity:.35;}}`}</style>
      <div className="pd"/>
    </>
  )
}