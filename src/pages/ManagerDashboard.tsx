import React, { useState } from 'react'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { courses } from '../services/mockData'
import RadarComp from '../components/RadarChart'
import TeamGoalTracker from '../components/TeamGoalTracker'


export default function ManagerDashboard(){
  const employees = useEmployeeStore(s=>s.employees)

  const aggregated = employees[0].skills.map(sk=>({skill: sk.skillId, value: Math.min(5, Math.round((sk.level+2)/2))}))

  const radarData = aggregated.map(a=>({skill: a.skill, value: a.value}))
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id)
  const assignCourse = useEmployeeStore(s=>s.assignCourse)
  const unassignCourse = useEmployeeStore(s=>s.unassignCourse)

  const selEmp = employees.find(e=>e.id===selectedEmployee) || employees[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="card">
            <div className="text-lg font-semibold">Team Overview</div>
            <div className="mt-4 space-y-3">
              {employees.map(e=> (
                <div key={e.id} className={`flex items-center justify-between p-2 rounded ${e.id===selectedEmployee ? 'bg-slate-800' : ''}`}>
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-sm text-slate-400">{e.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-300">{e.skills.length}</div>
                    <button onClick={()=>setSelectedEmployee(e.id)} className="px-2 py-1 bg-slate-700 rounded text-sm">Select</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-5">
          <RadarComp data={radarData} />
        </div>
        <div className="col-span-3">
          <div className="card flex flex-col items-start">
            <div className="text-lg font-semibold">Team Learning</div>
            <div className="mt-3 text-slate-300">Use the AI Coach to generate team learning suggestions and assessments.</div>
            <div className="mt-4">
              <button onClick={() => (window as any).openAICoach?.()} className="px-4 py-2 bg-primary text-white rounded">Open AI Coach</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card col-span-2">
          <div className="text-lg font-semibold">Assign Courses</div>
          <div className="text-sm text-slate-400">Selected: {selEmp?.name}</div>
          <div className="mt-3 grid gap-2">
            {courses.map(c=> (
              <div key={c.id} className="flex items-center justify-between p-2 bg-slate-900 rounded">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-slate-400">{c.provider}</div>
                </div>
                <div>
                  {(selEmp?.assignedCourses||[]).includes(c.id) ? (
                    <button onClick={()=>unassignCourse(selEmp.id, c.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Unassign</button>
                  ) : (
                    <button onClick={()=>assignCourse(selEmp.id, c.id)} className="px-3 py-1 bg-primary text-white rounded text-sm">Assign</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="text-lg font-semibold">Selected Employee Assignments</div>
          <div className="mt-3">
            {(selEmp?.assignedCourses||[]).length===0 && <div className="text-slate-400">No assigned courses</div>}
            <ul className="mt-2 space-y-2">
              {(selEmp?.assignedCourses||[]).map(ac=>{
                const c = courses.find(x=>x.id===ac)
                return <li key={ac} className="p-2 bg-slate-900 rounded">{c?.title || ac}</li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
