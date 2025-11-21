import React from 'react'
import { useMemo } from 'react'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { useSkillsStore } from '../store/useSkillsStore'
import SkillCard from '../components/SkillCard'
import RadarComp from '../components/RadarChart'
// Chat UI is available as a global pop-out via the ChatLauncher (floating button)
import { courses as allCourses } from '../services/mockData'

export default function EmployeeDashboard(){
  const employees = useEmployeeStore(s=>s.employees)
  const skills = useSkillsStore(s=>s.skills)
  const me = employees[0]

  const radarData = useMemo(()=>{
    return skills.slice(0,6).map(sk=>({skill:sk.name, value: (me.skills.find(ms=>ms.skillId===sk.id)?.level||1)}))
  },[skills,me])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">{me.name.split(' ').map(n=>n[0]).join('')}</div>
              <div>
                <div className="text-lg font-semibold">{me.name}</div>
                <div className="text-sm text-slate-400">{me.title}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-slate-400">Top Skills</div>
              <div className="mt-3 grid grid-cols-1 gap-3">
                {me.skills.map(ms=>{
                  const s = skills.find(x=>x.id===ms.skillId)
                  return <SkillCard key={ms.skillId} name={s?.name||ms.skillId} level={ms.level} />
                })}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-slate-400">Assigned Learning</div>
              <div className="mt-3 space-y-2">
                {(me.assignedCourses||[]).length===0 && <div className="text-slate-400">No assignments</div>}
                {(me.assignedCourses||[]).map(id=> (
                  <div key={id} className="p-2 bg-slate-900 rounded">{(allCourses.find(c=>c.id===id)?.title) || id}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5">
          <RadarComp data={radarData} />
        </div>
        <div className="col-span-3">
          <div className="card flex flex-col items-start">
            <div className="text-sm text-slate-400">AI Coach</div>
            <div className="mt-3">
              <div className="text-slate-300">Open the AI Coach in the bottom-right to ask for skill recommendations.</div>
            </div>
            <div className="mt-4">
              <button onClick={() => (window as any).openAICoach?.()} className="px-4 py-2 bg-primary text-white rounded">Open AI Coach</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Career Path Explorer</div>
              <div className="text-sm text-slate-400">Compare your skills vs target roles</div>
            </div>
          </div>
          <div className="mt-4 text-slate-300">Position selector and gap heatmap (simulated)</div>
        </div>
        <div className="card">
          <div className="text-lg font-semibold">Learning Recommendations</div>
          <div className="mt-3 grid gap-3">
            <div className="p-3 bg-slate-900 rounded">Advanced React Patterns — Pluralsight</div>
            <div className="p-3 bg-slate-900 rounded">TypeScript Deep Dive — Frontend Masters</div>
          </div>
        </div>
      </div>
    </div>
  )
}
