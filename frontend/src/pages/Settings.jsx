import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'

const VARIANTS = [
  { key:'bioluminescence', label:'Deep Bioluminescence', desc:'Neon cyan depths', color:'#38c9e8' },
  { key:'coral',           label:'Coral Reef',           desc:'Warm rose & teal', color:'#ff8fab' },
  { key:'sandy',           label:'Sandy Shore',          desc:'Golden horizon',   color:'#ffd27a' },
]
const TONES = [
  { key:'soft',    label:'Soft',    desc:'Gentle, warm, nurturing' },
  { key:'direct',  label:'Direct',  desc:'Clear, grounded, honest' },
  { key:'minimal', label:'Minimal', desc:'Quiet, spacious, sparse' },
]

export default function Settings() {
  const nav = useNavigate()
  const { oceanVariant, setOceanVariant, tonePref, setTonePref, clearMessages } = useStore()

  return (
    <div style={{position:'relative',zIndex:10,height:'100vh',overflowY:'auto',padding:'40px 28px',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{width:'100%',maxWidth:680}}>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:40}}>
          <div>
            <p style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--biolume)',letterSpacing:4,textTransform:'uppercase',marginBottom:8}}>Preferences</p>
            <h1 style={{fontSize:36,fontWeight:300,color:'var(--white)'}}>Your <em style={{fontStyle:'italic',color:'var(--biolume)'}}>Ocean</em></h1>
          </div>
          <button onClick={()=>nav('/')}
            style={{background:'none',border:'1px solid rgba(56,201,232,.15)',borderRadius:20,padding:'8px 18px',color:'var(--text-dim)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:2,textTransform:'uppercase'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(56,201,232,.4)';e.currentTarget.style.color='var(--biolume)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(56,201,232,.15)';e.currentTarget.style.color='var(--text-dim)'}}>
            ← Back
          </button>
        </motion.div>

        {/* Ocean variant */}
        <Section title="Ocean Environment" delay={.1}>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {VARIANTS.map(v=>(
              <motion.button key={v.key} onClick={()=>setOceanVariant(v.key)} whileHover={{x:4}}
                style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',borderRadius:14,
                  border:`1px solid ${oceanVariant===v.key ? v.color+'55' : 'rgba(56,201,232,.1)'}`,
                  background: oceanVariant===v.key ? `${v.color}0d` : 'rgba(11,29,46,.5)',
                  textAlign:'left',transition:'all .25s'}}>
                <div style={{width:12,height:12,borderRadius:'50%',background:v.color,boxShadow:`0 0 10px ${v.color}88`,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:400,color:'var(--white)',marginBottom:3}}>{v.label}</div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:1}}>{v.desc}</div>
                </div>
                {oceanVariant===v.key && (
                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:v.color,letterSpacing:2}}>ACTIVE</div>
                )}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Tone */}
        <Section title="Nova's Tone" delay={.2}>
          <div style={{display:'flex',gap:10}}>
            {TONES.map(t=>(
              <motion.button key={t.key} onClick={()=>setTonePref(t.key)}
                whileHover={{scale:1.03}} whileTap={{scale:.97}}
                style={{flex:1,padding:'16px 12px',borderRadius:14,
                  border:`1px solid ${tonePref===t.key ? 'rgba(56,201,232,.5)' : 'rgba(56,201,232,.1)'}`,
                  background: tonePref===t.key ? 'rgba(56,201,232,.07)' : 'rgba(11,29,46,.5)',
                  display:'flex',flexDirection:'column',gap:6,transition:'all .25s'}}>
                <div style={{fontSize:15,fontWeight:400,color:'var(--white)'}}>{t.label}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:.5}}>{t.desc}</div>
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Session */}
        <Section title="Session" delay={.3}>
          <Btn onClick={clearMessages}>Clear conversation history</Btn>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children, delay=0 }) {
  return (
    <motion.div
      initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay,duration:.6}}
      style={{background:'linear-gradient(135deg,rgba(11,29,46,.8),rgba(4,14,24,.9))',border:'1px solid rgba(56,201,232,.1)',borderRadius:20,padding:28,marginBottom:18}}>
      <p style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3,textTransform:'uppercase',marginBottom:18}}>{title}</p>
      {children}
    </motion.div>
  )
}

function Btn({ onClick, children, primary }) {
  return (
    <motion.button onClick={onClick} whileHover={{scale:1.02}} whileTap={{scale:.97}}
      style={{padding:'11px 22px',
        background: primary ? 'linear-gradient(135deg,var(--foam),var(--biolume))' : 'transparent',
        border: primary ? 'none' : '1px solid rgba(56,201,232,.2)',
        borderRadius:12,
        color: primary ? 'var(--void)' : 'var(--text-dim)',
        fontFamily:'var(--font-serif)',fontSize:16,
        fontWeight: primary ? 600 : 300}}>
      {children}
    </motion.button>
  )
}