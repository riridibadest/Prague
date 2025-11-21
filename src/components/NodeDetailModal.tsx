import React from 'react'
import type { Node } from '../services/csvAnalyzer'

export default function NodeDetailModal({node, onClose}:{node:Node|null; onClose:()=>void}){
  if(!node) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-slate-900 p-6 rounded-xl z-10 w-96 glass">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold">{node.label}</div>
            <div className="text-sm text-slate-400">Type: {node.type}</div>
          </div>
          <button onClick={onClose} className="text-slate-400">Close</button>
        </div>
        <div className="mt-4 text-slate-300">ID: {node.id}</div>
        <div className="mt-3 text-sm text-slate-400">This is a mock details panel; when connected to a real dataset this would show attributes, linked records and timeline.</div>
      </div>
    </div>
  )
}
