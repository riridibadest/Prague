import React from 'react'
import type { Node, Edge } from '../services/csvAnalyzer'

function useLayout(nodes: Node[]){
  // Simple column layout: group by type
  const groups: Record<string, Node[]> = {}
  nodes.forEach(n=>{ groups[n.type] = groups[n.type] || []; groups[n.type].push(n) })

  const types = Object.keys(groups)
  const width = 900
  const height = 400
  const columnWidth = width / Math.max(1, types.length)

  const positions: Record<string, {x:number;y:number}> = {}
  types.forEach((t,ti)=>{
    const col = groups[t]
    const step = height / Math.max(1, col.length+1)
    col.forEach((n, i)=>{
      positions[n.id] = { x: 80 + ti*columnWidth, y: (i+1)*step }
    })
  })
  return { positions, width, height }
}

export default function GraphView({nodes, edges, onNodeClick}:{nodes:Node[]; edges:Edge[]; onNodeClick?: (n:Node)=>void}){
  const { positions, width, height } = useLayout(nodes)

  return (
    <div className="card overflow-auto">
      <div className="text-sm text-slate-400">Graph visualization (heuristic)</div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="mt-3">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#94a3b8" />
          </marker>
        </defs>
        {edges.map((e, idx)=>{
          const s = positions[e.source]
          const t = positions[e.target]
          if(!s || !t) return null
          return <line key={idx} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />
        })}
        {nodes.map(n=>{
          const p = positions[n.id] || {x:20, y:20}
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`} style={{cursor: onNodeClick ? 'pointer' : 'default'}} onClick={()=>onNodeClick?.(n)}>
              <rect x={-70} y={-18} width={140} height={36} rx={8} fill="#071126" stroke="#334155" />
              <text x={0} y={6} textAnchor="middle" fill="#e2e8f0" style={{fontSize:12}}>{n.label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
