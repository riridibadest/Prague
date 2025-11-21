import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SettingsModal from './SettingsModal'

export default function Header(){
  const loc = useLocation()
  const [openSettings, setOpenSettings] = useState(false)
  const [llmConfigured, setLlmConfigured] = useState(false)

  React.useEffect(()=>{
    const key = localStorage.getItem('ai_api_key')
    const endpoint = localStorage.getItem('ai_azure_endpoint')
    const deployment = localStorage.getItem('ai_azure_deployment')
    setLlmConfigured(!!(key && endpoint && deployment))
  }, [openSettings])
  return (
    <>
    <header className="border-b border-slate-800 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow">AI</div>
          <div>
            <div className="text-lg font-semibold">AI Skill Coach</div>
            <div className="text-xs text-slate-400">Enterprise skills & career prototyping</div>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/" className={`px-3 py-2 rounded-md ${loc.pathname==='/'? 'bg-slate-800':'hover:bg-slate-800'}`}>Home</Link>
          <Link to="/employee" className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/employee')? 'bg-slate-800':''}`}>Employee</Link>
          <Link to="/manager" className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/manager')? 'bg-slate-800':''}`}>Manager</Link>
          <Link to="/upload" className="px-3 py-2 rounded-md hover:bg-slate-800">Upload</Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md">
              <div className={`w-2 h-2 rounded-full ${llmConfigured ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <div className="text-xs text-slate-400">LLM</div>
            </div>
            <button onClick={()=>setOpenSettings(true)} className="px-3 py-2 rounded-md hover:bg-slate-800">Settings</button>
          </div>
        </nav>
      </div>
    </header>
    <SettingsModal open={openSettings} onClose={()=>setOpenSettings(false)} />
    </>
  )
}
