import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const MOODS = [
  {
    score: 10, key: 'radiant', label: 'Radiant',
    icon: (active) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? '#38c9e8' : 'rgba(56,201,232,.4)'} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2"  x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2"  y1="12" x2="5"  y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
        <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"/>
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
        <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66"/>
        <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"/>
      </svg>
    ),
    color: '#38c9e8',
  },
  {
    score: 8, key: 'calm', label: 'Calm',
    icon: (active) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? '#82dff0' : 'rgba(130,223,240,.4)'} strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 12 Q6 6 12 12 Q18 18 22 12"/>
      </svg>
    ),
    color: '#82dff0',
  },
  {
    score: 6, key: 'okay', label: 'Okay',
    icon: (active) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? '#90e0c0' : 'rgba(144,224,192,.4)'} strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 12 Q6 9 12 12 Q18 15 22 12"/>
        <path d="M2 16 Q6 13 12 16 Q18 19 22 16" opacity="0.4"/>
      </svg>
    ),
    color: '#90e0c0',
  },
  {
    score: 4, key: 'low', label: 'Low',
    icon: (active) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? '#8ab4c0' : 'rgba(138,180,192,.4)'} strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 10 Q6 14 12 10 Q18 6 22 10"/>
        <line x1="12" y1="14" x2="12" y2="18"/>
        <line x1="9"  y1="18" x2="15" y2="18"/>
      </svg>
    ),
    color: '#8ab4c0',
  },
  {
    score: 2, key: 'heavy', label: 'Heavy',
    icon: (active) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? '#5a7d8a' : 'rgba(90,125,138,.4)'} strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 3 C6 3 3 7 3 10 C3 14 6 16 9 16 L9 20"/>
        <path d="M12 3 C18 3 21 7 21 10 C21 14 18 16 15 16 L15 20"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
      </svg>
    ),
    color: '#5a7d8a',
  },
]

export default function Mood() {
  const nav = useNavigate()
  const { moodLogs, addMoodLog } = useStore()
  const [selected, setSelected] = useState(null)
  const [note, setNote]         = useState('')
  const [logged, setLogged]     = useState(false)

  const handleLog = () => {
    if(!selected) return
    addMoodLog({ score: selected.score, emoji: selected.key, note, logged_at: new Date().toISOString() })
    setLogged(true)
    setTimeout(() => setLogged(false), 2500)
    setNote(''); setSelected(null)
  }

  const chartData = moodLogs.slice(-14).map(l => ({
    day:   new Date(l.logged_at).toLocaleDateString('en', { weekday:'short' }),
    score: l.score,
  }))

  return (
    <div style={{position:'relative',zIndex:10,height:'100vh',overflowY:'auto',padding:'40px 28px 120px',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{width:'100%',maxWidth:700}}>

        {/* Header */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:40}}>
          <div>
            <p style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--biolume)',letterSpacing:4,textTransform:'uppercase',marginBottom:10}}>Daily Check-in</p>
            <h1 style={{fontSize:38,fontWeight:300,color:'var(--white)',lineHeight:1.1}}>
              How are you, <em style={{fontStyle:'italic',color:'var(--biolume)'}}>really?</em>
            </h1>
          </div>
          <button onClick={() => nav('/')}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(56,201,232,.4)'; e.currentTarget.style.color='var(--biolume)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(56,201,232,.13)'; e.currentTarget.style.color='var(--text-dim)' }}
            style={{background:'none',border:'1px solid rgba(56,201,232,.13)',borderRadius:20,padding:'7px 17px',color:'var(--text-dim)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:2,textTransform:'uppercase',transition:'all .3s',marginTop:6}}>
            ← Home
          </button>
        </motion.div>

        {/* Mood selector card */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.15}}
          style={{background:'linear-gradient(135deg,rgba(11,29,46,.8),rgba(4,14,24,.9))',border:'1px solid rgba(56,201,232,.1)',borderRadius:20,padding:32,marginBottom:20}}>

          <p style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3,textTransform:'uppercase',marginBottom:20}}>
            Select your current state
          </p>

          {/* Mood cards */}
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {MOODS.map(m => {
              const active = selected?.key === m.key
              return (
                <motion.button key={m.key} onClick={() => setSelected(active ? null : m)}
                  whileHover={{scale:1.04,y:-2}} whileTap={{scale:.97}}
                  style={{
                    flex:1, minWidth:90,
                    padding:'20px 12px',borderRadius:16,
                    border:`1px solid ${active ? m.color+'55' : 'rgba(56,201,232,.08)'}`,
                    background: active ? `${m.color}0e` : 'rgba(7,18,28,.6)',
                    display:'flex',flexDirection:'column',alignItems:'center',gap:12,
                    transition:'all .25s',
                    boxShadow: active ? `0 0 20px ${m.color}18` : 'none',
                  }}>
                  {m.icon(active)}
                  <span style={{
                    fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:2,textTransform:'uppercase',
                    color: active ? m.color : 'var(--muted)',
                    transition:'color .25s',
                  }}>{m.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Note input */}
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note… (optional)"
            rows={2}
            style={{
              width:'100%',marginTop:20,padding:'13px 18px',
              background:'rgba(4,14,24,.6)',
              border:'1px solid rgba(56,201,232,.08)',borderRadius:14,
              color:'var(--light)',fontFamily:'var(--font-serif)',
              fontSize:16,fontWeight:300,outline:'none',resize:'none',
              transition:'border-color .3s',
            }}
            onFocus={e  => e.target.style.borderColor='rgba(56,201,232,.25)'}
            onBlur={e   => e.target.style.borderColor='rgba(56,201,232,.08)'}
          />

          {/* Log button */}
          <motion.button onClick={handleLog}
            whileHover={selected ? {scale:1.01} : {}} whileTap={selected ? {scale:.98} : {}}
            style={{
              width:'100%',marginTop:14,padding:'15px',
              background: selected
                ? `linear-gradient(135deg, ${selected.color}44, ${selected.color}22)`
                : 'rgba(20,50,70,.3)',
              border: `1px solid ${selected ? selected.color+'44' : 'rgba(56,201,232,.07)'}`,
              borderRadius:14,
              color: selected ? selected.color : 'var(--muted)',
              fontFamily:'var(--font-serif)',fontSize:18,fontWeight:300,
              letterSpacing:.5,transition:'all .3s',
            }}>
            {logged ? '✓ Logged' : 'Log this moment'}
          </motion.button>
        </motion.div>

        {/* Chart */}
        {chartData.length > 1 && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}
            style={{background:'linear-gradient(135deg,rgba(11,29,46,.8),rgba(4,14,24,.9))',border:'1px solid rgba(56,201,232,.1)',borderRadius:20,padding:32}}>
            <p style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3,textTransform:'uppercase',marginBottom:22}}>
              Last {chartData.length} check-ins
            </p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" stroke="transparent" tick={{fontFamily:'var(--font-mono)',fontSize:10,fill:'var(--muted)'}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,10]} stroke="transparent" tick={{fontFamily:'var(--font-mono)',fontSize:10,fill:'var(--muted)'}} axisLine={false} tickLine={false} width={18}/>
                <Tooltip
                  contentStyle={{background:'rgba(4,14,24,.95)',border:'1px solid rgba(56,201,232,.15)',borderRadius:10,fontFamily:'var(--font-mono)',fontSize:11,color:'var(--light)'}}
                  cursor={{stroke:'rgba(56,201,232,.1)',strokeWidth:1}}
                />
                <Line type="monotone" dataKey="score" stroke="var(--biolume)" strokeWidth={1.5}
                  dot={{fill:'var(--biolume)',r:3,strokeWidth:0}}
                  activeDot={{r:5,fill:'var(--glow)',strokeWidth:0}}/>
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {chartData.length === 0 && (
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}
            style={{textAlign:'center',padding:'40px 0',color:'var(--muted)',fontStyle:'italic',fontSize:16,fontFamily:'var(--font-serif)'}}>
            Log your first mood to start seeing patterns…
          </motion.p>
        )}

      </div>
    </div>
  )
}