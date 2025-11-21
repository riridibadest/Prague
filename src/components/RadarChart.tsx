import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

type Entry = { skill:string; value:number }

export default function RadarComp({data}:{data:Entry[]}){
  return (
    <div className="card h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius={80}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
          <PolarRadiusAxis angle={30} domain={[0,5]} />
          <Radar name="You" dataKey="value" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
