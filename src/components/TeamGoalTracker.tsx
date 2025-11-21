import React, { useState } from 'react'

export default function TeamGoalTracker(){
  const [currentVelocity, setCurrentVelocity] = useState<number>(28)
  const [target, setTarget] = useState<number>(35)

  const pct = Math.min(100, Math.round((currentVelocity/target)*100))

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Team Velocity Goal</div>
          <div className="text-sm text-slate-400">Average Points Delivered Per Sprint</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-primary">{currentVelocity}</div>
          <div className="text-sm text-slate-400">Current Velocity</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-slate-800 rounded h-4 overflow-hidden">
          <div style={{width:`${pct}%`}} className="h-full bg-gradient-to-r from-primary to-accent" />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <div>Target: <span className="text-slate-200 font-semibold">{target}</span></div>
          <div>{pct}% of target</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <input type="number" value={target} onChange={e=>setTarget(Number(e.target.value))} className="p-2 bg-slate-800 rounded w-32" />
        <button onClick={()=>setCurrentVelocity(v=>v+1)} className="px-3 py-2 bg-primary text-white rounded">+1</button>
        <button onClick={()=>setCurrentVelocity(v=>v-1)} className="px-3 py-2 bg-slate-700 text-white rounded">-1</button>
      </div>
    </div>
  )
}
