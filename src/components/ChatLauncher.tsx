import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatUI from './ChatUI'

export default function ChatLauncher(){
  const [open, setOpen] = useState(false)
  React.useEffect(()=>{
    // expose a global helper so other components can open the chat
    ;(window as any).openAICoach = () => setOpen(true)
    return ()=>{ (window as any).openAICoach = undefined }
  }, [])
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-end justify-end p-6">
            <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
            <motion.div initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:40, opacity:0}} className="w-96 h-[520px] bg-slate-900 rounded-2xl shadow-2xl glass p-4 z-10 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">AI Coach</div>
                <button onClick={()=>setOpen(false)} className="text-slate-400">Close</button>
              </div>
              <div className="mt-3 flex-1">
                <ChatUI />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={()=>setOpen(true)} className="fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-xl flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </>
  )
}
