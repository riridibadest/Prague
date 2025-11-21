import React, { useState, useEffect } from 'react'

export default function SettingsModal({open, onClose}:{open:boolean; onClose:()=>void}){
  const [key, setKey] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [deployment, setDeployment] = useState('')
  useEffect(()=>{
    setKey(localStorage.getItem('ai_api_key')||'')
    setEndpoint(localStorage.getItem('ai_azure_endpoint')||'')
    setDeployment(localStorage.getItem('ai_azure_deployment')||'')
  }, [open])

  function save(){
    localStorage.setItem('ai_api_key', key)
    localStorage.setItem('ai_azure_endpoint', endpoint)
    localStorage.setItem('ai_azure_deployment', deployment)
    onClose()
  }

  if(!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-slate-900 p-6 rounded-xl z-10 w-96 glass">
        <div className="text-lg font-semibold">Settings</div>
        <div className="text-sm text-slate-400 mt-1">Configure LLM integration (stored locally)</div>
        <div className="mt-4 space-y-2">
          <label className="text-xs text-slate-400">Azure OpenAI API Key</label>
          <input className="w-full p-2 bg-slate-800 rounded" value={key} onChange={e=>setKey(e.target.value)} placeholder="API Key" />
          <label className="text-xs text-slate-400">Azure OpenAI Endpoint (e.g. https://your-resource.openai.azure.com)</label>
          <input className="w-full p-2 bg-slate-800 rounded" value={endpoint} onChange={e=>setEndpoint(e.target.value)} placeholder="Endpoint URL" />
          <label className="text-xs text-slate-400">Deployment Name</label>
          <input className="w-full p-2 bg-slate-800 rounded" value={deployment} onChange={e=>setDeployment(e.target.value)} placeholder="Deployment" />
        </div>
        <div className="mt-4 flex.justify-end flex-row-reverse gap-2">
          <div className="flex-1" />
          <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          <button onClick={save} className="px-3 py-2 rounded bg-primary text-white">Save</button>
        </div>
      </div>
    </div>
  )
}
