import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { askAI } from '../services/mockLLM'

type Message = { id:string; from:'user'|'ai'; text:string }

export default function ChatUI(){
  const [messages, setMessages] = useState<Message[]>([ {id:'m1', from:'ai', text:'Hi — I am your AI Coach. Tell me what you want to grow in.'} ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)

  React.useEffect(()=>{
    setApiKey(localStorage.getItem('ai_api_key'))
  }, [])

  async function send(){
    if(!input) return
    const userMsg:Message = { id: 'u'+Date.now(), from:'user', text: input }
    setMessages(prev=>[...prev, userMsg])
    setInput('')
    setLoading(true)
    const { askLLM } = await import('../services/mockLLM')
    let aiText = ''
    try{
      aiText = await askLLM(input)
    }catch(err:any){
      aiText = `Error from LLM: ${err.message || String(err)}`
    }
    const aiMsg:Message = { id: 'a'+Date.now(), from:'ai', text: aiText }
    setMessages(prev=>[...prev, aiMsg])
    setLoading(false)
  }

  return (
    <div className="card flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 space-y-3">
        {messages.map(m=> (
          <motion.div key={m.id} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className={`max-w-xl ${m.from==='user' ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block p-3 rounded-2xl ${m.from==='user' ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-slate-800 text-slate-200'}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && <div className="text-sm text-slate-400">AI is thinking...</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2" placeholder="Ask the AI Coach..." />
        <button onClick={send} className="px-4 py-2 rounded bg-primary text-white">Send</button>
      </div>
    </div>
  )
}
