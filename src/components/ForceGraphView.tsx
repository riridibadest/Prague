import React, { useRef, useEffect, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import type { Node as CSVNode, Edge as CSVEdge } from '../services/csvAnalyzer'

type FGNode = { id: string; name: string; type: string }
type FGLink = { source: string; target: string; label?: string }

export default function ForceGraphView({ nodes, edges, onNodeClick, filter } : { nodes: CSVNode[]; edges: CSVEdge[]; onNodeClick?: (n: CSVNode)=>void; filter?: string }){
  const fgRef = useRef<any>()
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set())
  const [highlightLinks, setHighlightLinks] = useState<Set<number>>(new Set())

  const graphData = {
    nodes: nodes.map(n=>({ id:n.id, name:n.label, type:n.type })),
    links: edges.map((e, idx)=>({ source: e.source, target: e.target, label: e.label, id: idx }))
  }

  useEffect(()=>{
    if(fgRef.current){ fgRef.current.d3Force('charge').strength(-120) }
  }, [])

  function handleNodeHover(node:any){
    const nset = new Set<string>()
    const lset = new Set<number>()
    if(node){
      nset.add(node.id)
      graphData.links.forEach((l:any, idx:number)=>{
        if(l.source === node.id || l.target === node.id) { lset.add(idx); nset.add(l.source); nset.add(l.target) }
      })
    }
    setHighlightNodes(nset)
    setHighlightLinks(lset)
  }

  return (
    <div className="card p-0">
      <div className="text-sm text-slate-400 p-4">Force-directed graph (interactive)</div>
      <div style={{height:420}}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData as any}
          nodeLabel={(n:any)=>n.name}
          nodeCanvasObject={(node:any, ctx:any, globalScale:any) => {
            const label = node.name
            const fontSize = 12/globalScale
            ctx.font = `${fontSize}px Sans-Serif`
            const textWidth = ctx.measureText(label).width
            const bckgDimensions = [textWidth, fontSize].map(n=>n + 8)

            ctx.fillStyle = highlightNodes.has(node.id) ? '#1e293b' : '#071126'
            ctx.strokeStyle = '#334155'
            ctx.fillRect(node.x - bckgDimensions[0]/2, node.y - bckgDimensions[1]/2, ...bckgDimensions)
            ctx.fillStyle = '#e2e8f0'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(label, node.x, node.y)
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={(link:any, idx:number) => highlightLinks.has(link.id) ? 2.5 : 0}
          onNodeHover={handleNodeHover}
          onNodeClick={(n:any)=> onNodeClick && onNodeClick({ id:n.id, label:n.name, type:n.type })}
          nodeVisibility={(n:any)=> !filter || n.name.toLowerCase().includes(filter.toLowerCase()) }
          linkWidth={(l:any)=> highlightLinks.has(l.id) ? 2 : 0.6 }
        />
      </div>
    </div>
  )
}
