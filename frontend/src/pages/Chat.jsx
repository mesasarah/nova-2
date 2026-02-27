import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../lib/store'
import { streamChat } from '../lib/api'

const MOODS = [
  { label:'Calm',    key:'calm',    color:'#38c9e8' },
  { label:'Okay',    key:'okay',    color:'#82dff0' },
  { label:'Anxious', key:'anxious', color:'#ffd27a' },
  { label:'Sad',     key:'sad',     color:'#8ab4c0' },
  { label:'Heavy',   key:'heavy',   color:'#3d6b7a' },
]

const OPENERS = [
  "Hey. I'm here. No rush — what's on your mind today?",
  "This space is yours. What's been sitting with you lately?",
  "I'm glad you're here. How are you actually doing — not the polished version, the real one.",
  "Whatever you bring here is welcome. What's going on for you?",
]

function ts() { return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) }

export default function Chat() {
  const nav = useNavigate()
  const { messages, addMessage, currentMood, setMood } = useStore()

  const [input, setInput]           = useState('')
  const [streaming, setStreaming]   = useState(false)
  const [streamText, setStreamText] = useState('')

  const msgsEnd     = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    if(messages.length === 0) {
      const opener = OPENERS[Math.floor(Math.random() * OPENERS.length)]
      addMessage({ role:'assistant', content:opener, time: ts() })
    }
  }, [])

  useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, streamText])

  const handleSend = async () => {
    const text = input.trim()
    if(!text || streaming) return

    setInput('')
    textareaRef.current.style.height = 'auto'

    const userMsg = {
      role: 'user',
      content: currentMood ? `[Mood: ${currentMood}] ${text}` : text,
      displayContent: text,
      time: ts()
    }
    addMessage(userMsg)
    setStreaming(true)
    setStreamText('')

    let full = ''
    await streamChat({
      messages: [...messages, userMsg].map(m => ({ role:m.role, content:m.content })),
      mood: currentMood,
      onToken: t  => { full += t; setStreamText(full) },
      onDone:  ()  => { setStreaming(false); setStreamText(''); addMessage({ role:'assistant', content:full, time: ts() }) },
      onError: ()  => { setStreaming(false); setStreamText(''); addMessage({ role:'assistant', content:"Something shifted in the connection. Take a breath — try again.", time: ts() }) }
    })
  }

  const handleKey = e => {
    if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div style={{position:'relative',zIndex:10,height:'100vh',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{width:'100%',maxWidth:760,height:'100vh',display:'flex',flexDirection:'column'}}>

        {/* ── Header ── */}
        <div style={{display:'flex',alignItems:'center',gap:14,padding:'22px 34px',borderBottom:'1px solid rgba(56,201,232,.07)',backdropFilter:'blur(18px)',background:'linear-gradient(180deg,rgba(2,12,20,.95) 0%,transparent 100%)',flexShrink:0}}>
          <NovaAvatar />
          <div style={{flex:1}}>
            <div style={{fontSize:20,fontWeight:400,color:'var(--white)',letterSpacing:.4}}>Nova</div>
          </div>
          <button
            onClick={() => nav('/')}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(56,201,232,.4)'; e.currentTarget.style.color='var(--biolume)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(56,201,232,.13)'; e.currentTarget.style.color='var(--text-dim)' }}
            style={{background:'none',border:'1px solid rgba(56,201,232,.13)',borderRadius:20,padding:'7px 17px',color:'var(--text-dim)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:2,textTransform:'uppercase',transition:'all .3s'}}>
            ← Leave
          </button>
        </div>

        {/* ── Mood bar ── */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'12px 34px 0',flexShrink:0,flexWrap:'wrap'}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:2,textTransform:'uppercase',marginRight:4}}>Feeling →</span>
          {MOODS.map(m => (
            <motion.button
              key={m.key}
              onClick={() => setMood(currentMood === m.key ? null : m.key)}
              whileHover={{scale:1.06}} whileTap={{scale:.94}}
              style={{
                display:'flex',alignItems:'center',gap:6,
                padding:'5px 13px',borderRadius:20,
                border:`1px solid ${currentMood===m.key ? m.color+'88' : 'rgba(56,201,232,.1)'}`,
                background: currentMood===m.key ? m.color+'12' : 'transparent',
                transition:'all .25s',
              }}>
              <div style={{
                width:6,height:6,borderRadius:'50%',background:m.color,
                boxShadow: currentMood===m.key ? `0 0 8px ${m.color}` : 'none',
                opacity: currentMood===m.key ? 1 : .4,
                transition:'all .25s',
              }}/>
              <span style={{
                fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:1.5,textTransform:'uppercase',
                color: currentMood===m.key ? m.color : 'var(--muted)',
                transition:'color .25s',
              }}>{m.label}</span>
            </motion.button>
          ))}
        </div>

        {/* ── Messages ── */}
        <div style={{flex:1,overflowY:'auto',padding:'28px 34px',display:'flex',flexDirection:'column',gap:26}}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                transition={{duration:.45,ease:[.22,1,.36,1]}}
                style={{display:'flex',gap:12,alignItems:'flex-end',flexDirection:msg.role==='user'?'row-reverse':'row'}}>

                <div style={{
                  width:30,height:30,borderRadius:'50%',flexShrink:0,
                  border:`1px solid ${msg.role==='user'?'rgba(255,143,171,.22)':'rgba(56,201,232,.18)'}`,
                  background: msg.role==='user'?'rgba(255,143,171,.07)':'radial-gradient(circle,var(--shore),var(--deep))',
                  display:'flex',alignItems:'center',justifyContent:'center',
                }}>
                  {msg.role==='user' ? <UserIcon /> : <WaveIcon />}
                </div>

                <div>
                  <div style={{
                    maxWidth:'72%',padding:'15px 20px',borderRadius:20,
                    fontSize:17,fontWeight:300,lineHeight:1.78,
                    ...(msg.role==='user'
                      ? {background:'linear-gradient(135deg,rgba(255,143,171,.07),rgba(255,143,171,.03))',border:'1px solid rgba(255,143,171,.13)',borderBottomRightRadius:5,color:'var(--white)'}
                      : {background:'linear-gradient(135deg,rgba(11,29,46,.92),rgba(4,14,24,.96))',border:'1px solid rgba(56,201,232,.1)',borderBottomLeftRadius:5,color:'var(--light)',backdropFilter:'blur(8px)'})
                  }}>
                    {msg.displayContent || msg.content}
                  </div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:1,marginTop:5,textAlign:msg.role==='user'?'right':'left'}}>
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming bubble */}
          {streaming && (
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{display:'flex',gap:12,alignItems:'flex-end'}}>
              <div style={{width:30,height:30,borderRadius:'50%',border:'1px solid rgba(56,201,232,.18)',background:'radial-gradient(circle,var(--shore),var(--deep))',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <WaveIcon />
              </div>
              <div style={{maxWidth:'72%',padding:'15px 20px',borderRadius:20,borderBottomLeftRadius:5,background:'linear-gradient(135deg,rgba(11,29,46,.92),rgba(4,14,24,.96))',border:'1px solid rgba(56,201,232,.1)',fontSize:17,fontWeight:300,lineHeight:1.78,color:'var(--light)',backdropFilter:'blur(8px)'}}>
                {streamText || <TypingDots />}
              </div>
            </motion.div>
          )}

          <div ref={msgsEnd} />
        </div>

        {/* ── Input ── */}
        <div style={{padding:'18px 34px 90px',flexShrink:0,background:'linear-gradient(0deg,rgba(2,12,20,.98) 0%,transparent 100%)',backdropFilter:'blur(18px)'}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:12,background:'linear-gradient(135deg,rgba(11,29,46,.8),rgba(4,14,24,.9))',border:'1px solid rgba(56,201,232,.14)',borderRadius:28,padding:'13px 13px 13px 22px',transition:'border-color .3s'}}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,115)+'px' }}
              onKeyDown={handleKey}
              placeholder="Say anything. This is your space…"
              style={{flex:1,background:'none',border:'none',outline:'none',color:'var(--white)',fontFamily:'var(--font-serif)',fontSize:17,fontWeight:300,lineHeight:1.6,resize:'none',maxHeight:115,scrollbarWidth:'none'}}
            />
            <motion.button
              onClick={handleSend}
              whileHover={{scale:1.1}} whileTap={{scale:.93}}
              style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,var(--foam),var(--biolume))',border:'none',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 0 18px rgba(56,201,232,.22)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </motion.button>
          </div>
          <p style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:2,textAlign:'center',marginTop:12,textTransform:'uppercase'}}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </div>
  )
}

function NovaAvatar() {
  return (
    <div style={{width:40,height:40,borderRadius:'50%',border:'1px solid rgba(56,201,232,.28)',background:'radial-gradient(circle at 40% 35%,var(--shore),var(--deep))',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',boxShadow:'0 0 18px rgba(56,201,232,.12)'}}>
      <WaveIcon />
      <div style={{position:'absolute',width:8,height:8,borderRadius:'50%',background:'var(--biolume)',bottom:0,right:0,boxShadow:'0 0 8px var(--biolume)'}}/>
    </div>
  )
}

function WaveIcon() {
  return (
    <svg viewBox="0 0 22 22" fill="none" width="13" height="13">
      <path d="M4 11 Q7.5 4 11 11 Q14.5 18 18 11" stroke="rgba(56,201,232,.85)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="rgba(255,143,171,.7)" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}

function TypingDots() {
  return (
    <>
      <style>{`
        .td{width:6px;height:6px;border-radius:50%;background:var(--biolume);opacity:.25;animation:tdw 1.4s ease-in-out infinite;display:inline-block;margin-right:4px;}
        .td:nth-child(2){animation-delay:.2s}
        .td:nth-child(3){animation-delay:.4s}
        @keyframes tdw{0%,60%,100%{opacity:.22;transform:translateY(0)}30%{opacity:1;transform:translateY(-5px)}}
      `}</style>
      <span style={{display:'flex',gap:4,alignItems:'center',height:22}}>
        <span className="td"/><span className="td"/><span className="td"/>
      </span>
    </>
  )
}