import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import OceanCanvas from './components/OceanCanvas'
import Cursor from './components/Cursor'
import Particles from './components/Particles'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Mood from './pages/Mood'
import Settings from './pages/Settings'

const NAV = [
  { path:'/chat',     icon:'🌊', label:'Talk'     },
  { path:'/mood',     icon:'🌤', label:'Mood'     },
  { path:'/settings', icon:'⚙',  label:'Settings' },
]

function Nav() {
  const loc = useLocation()
  const nav = useNavigate()
  if(loc.pathname === '/') return null
  return (
    <motion.div
      initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}
      style={{
        position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',
        zIndex:20,display:'flex',gap:4,
        background:'rgba(2,12,20,.8)',backdropFilter:'blur(24px)',
        border:'1px solid rgba(56,201,232,.1)',borderRadius:60,padding:'8px 10px',
        boxShadow:'0 8px 40px rgba(0,0,0,.35)',
      }}
    >
      {NAV.map(n => {
        const active = loc.pathname === n.path
        return (
          <motion.button key={n.path} onClick={()=>nav(n.path)}
            whileHover={{scale:1.04}} whileTap={{scale:.96}}
            style={{
              display:'flex',alignItems:'center',gap:7,padding:'9px 18px',borderRadius:50,
              background: active?'rgba(56,201,232,.1)':'transparent',
              border:     active?'1px solid rgba(56,201,232,.25)':'1px solid transparent',
              transition:'all .3s',
            }}>
            <span style={{fontSize:14}}>{n.icon}</span>
            <span style={{
              fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:2,textTransform:'uppercase',
              color: active?'var(--biolume)':'var(--muted)',
            }}>{n.label}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <Cursor />
      <OceanCanvas />
      <Particles />
      <Nav />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
          transition={{duration:.55,ease:[.22,1,.36,1]}}
          style={{position:'relative',zIndex:10,height:'100vh'}}
        >
          <Routes location={location}>
            <Route path="/"         element={<Landing />} />
            <Route path="/chat"     element={<Chat />} />
            <Route path="/mood"     element={<Mood />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}