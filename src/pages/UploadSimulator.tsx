import React, { useState } from 'react'
import { analyzeCSV } from '../services/csvAnalyzer'
import GraphView from '../components/GraphView'
import ForceGraphView from '../components/ForceGraphView'
import NodeDetailModal from '../components/NodeDetailModal'

export default function UploadSimulator(){
  const [previews, setPreviews] = useState<{name:string; rows:string[][]; content:string}[]>([])
  const [selectedNode, setSelectedNode] = useState<any | null>(null)
  const [useForce, setUseForce] = useState(true)
  const [filter, setFilter] = useState('')
  const [graph, setGraph] = useState<{nodes:any[]; edges:any[]} | null>(null)

  function onFiles(e: React.ChangeEvent<HTMLInputElement>){
    const files = Array.from(e.target.files || [])
    files.forEach(f=>{
      const reader = new FileReader()
      reader.onload = () => {
        const text = String(reader.result || '')
        const rows = text.split('\n').slice(0,10).map(r=>r.split(','))
        setPreviews(prev=>[...prev, {name: f.name, rows, content: text }])
      }
      reader.readAsText(f)
    })
  }

  const [report, setReport] = useState<string | null>(null)

  async function analyze(fileIndex:number){
    const p = previews[fileIndex]
    if(!p) return
    // parse CSV into array of objects
    const lines = p.content.split(/\r?\n/).filter(Boolean)
    if(lines.length===0) return
    const headers = lines[0].split(',').map(h=>h.trim())
    const rows = lines.slice(1).map(r=>{
      const cols = r.split(',')
      const obj: Record<string,string> = {}
      headers.forEach((h,i)=> obj[h]= (cols[i]||'').trim())
      return obj
    })

    // determine column name to use for teamRelevantId
    const teamRelevantId = (document.getElementById('teamRelevantId') as HTMLInputElement)?.value || 'personal_number'
    const matchValue = (document.getElementById('matchValue') as HTMLInputElement)?.value || ''

    const filtered = rows.filter(r=>{
      const val = r[teamRelevantId] || r[teamRelevantId.trim().toLowerCase()] || r[teamRelevantId.trim().toUpperCase()]
      return val && (matchValue ? val === matchValue : false)
    })

    // Build prompt
    const payload = JSON.stringify(filtered, null, 2)
    const prompt = `Analyze the following JSON data for the current team members: ${payload}. Provide a structured, bulleted skill assessment summary for each individual, highlighting their top strength and one specific area for development.`

    setReport('Analyzing...')
    // Build a CSV from filtered rows so analyzer can create a graph
    const filteredCsvLines = [headers.join(',')]
    filtered.forEach(r=>{
      const line = headers.map(h=> (r[h]||'')).join(',')
      filteredCsvLines.push(line)
    })
    const filteredCsv = filteredCsvLines.join('\n')
    try{
      const g = analyzeCSV(filteredCsv, p.name)
      setGraph(g)
    }catch(e){
      // keep going even if analyzer fails
      console.warn('analyzeCSV error', e)
    }
    const { askLLM } = await import('../services/mockLLM')
    try{
      const res = await askLLM(prompt)
      setReport(res)
    }catch(err:any){
      setReport(`LLM error: ${err.message || String(err)}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-lg font-semibold">Upload Simulation</div>
        <div className="mt-3 text-slate-400">Choose one or more CSV files (simulation only). We'll preview first 10 rows and allow analysis into a graph.</div>
        <div className="mt-4">
          <input type="file" accept=".csv" multiple onChange={onFiles} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 items-center">
          <div>
            <label className="text-sm text-slate-400">teamRelevantId (column name)</label>
            <input id="teamRelevantId" defaultValue="personal_number" className="w-full p-2 bg-slate-800 rounded" />
          </div>
          <div>
            <label className="text-sm text-slate-400">Match value</label>
            <input id="matchValue" defaultValue="e1" className="w-full p-2 bg-slate-800 rounded" />
          </div>
          <div className="text-sm text-slate-400">Tip: set Match value to current user's identifier or your team id</div>
        </div>
      </div>

      {previews.map((p, idx)=>(
        <div key={idx} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-slate-400">Preview (first 10 rows)</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>analyze(idx)} className="px-4 py-2 bg-primary text-white rounded">Analyze to Graph</button>
            </div>
          </div>
          <div className="mt-3 overflow-auto">
            <table className="min-w-full text-left">
              <tbody>
                {p.rows.map((r, idy)=> (
                  <tr key={idy} className={idy%2? 'bg-slate-800':'bg-slate-900'}>
                    {r.map((c,ci)=>(<td key={ci} className="px-3 py-2 text-sm">{c}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {graph && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm text-slate-400">View</label>
            <button onClick={()=>setUseForce(true)} className={`px-3 py-1 rounded ${useForce? 'bg-primary text-white':'bg-slate-800'}`}>Force Graph</button>
            <button onClick={()=>setUseForce(false)} className={`px-3 py-1 rounded ${!useForce? 'bg-primary text-white':'bg-slate-800'}`}>Column Layout</button>
            <div className="ml-auto flex items-center gap-2">
              <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search nodes" className="bg-slate-900 p-2 rounded text-sm" />
              <button onClick={()=>setFilter('')} className="px-3 py-1 bg-slate-700 rounded">Clear</button>
            </div>
          </div>
          {useForce ? (
            <ForceGraphView nodes={graph.nodes} edges={graph.edges} onNodeClick={(n)=>setSelectedNode(n)} filter={filter} />
          ) : (
            <GraphView nodes={graph.nodes} edges={graph.edges} onNodeClick={(n)=>setSelectedNode(n)} />
          )}
          <NodeDetailModal node={selectedNode} onClose={()=>setSelectedNode(null)} />
        </div>
      )}
    </div>
  )
}
