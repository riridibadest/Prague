export type Node = { id: string; label: string; type: string }
export type Edge = { source: string; target: string; label?: string }

function normalizeHeader(h: string){
  return h.trim().toLowerCase()
}

export function analyzeCSV(content: string, fileName: string){
  const lines = content.split(/\r?\n/).filter(Boolean)
  if(lines.length===0) return { nodes: [], edges: [] }
  const headers = lines[0].split(',').map(h=>normalizeHeader(h))
  const rows = lines.slice(1).map(r=>r.split(','))

  const nodesMap = new Map<string, Node>()
  const edges: Edge[] = []

  function ensureNode(id:string,label:string,type:string){
    if(!nodesMap.has(id)) nodesMap.set(id, {id,label,type})
  }

  // Heuristics: look for common columns and variants
  rows.forEach((cols, idx) => {
    const row: Record<string,string> = {}
    headers.forEach((h,i)=> row[h]= (cols[i]||'').trim())

    // Employee identification
    const personal = row['personal_number'] || row['personal number'] || row['employee id'] || row['employeeid'] || ''
    if(personal){
      const empId = `emp:${personal}`
      ensureNode(empId, `Employee ${personal}`, 'Employee')

      const org = row['sa_org_hierarchy.objid'] || row['objid'] || row['sa_org_hierarchy'] || row['org'] || ''
      if(org){
        const orgId = `org:${org}`
        ensureNode(orgId, `Org ${org}`, 'Org')
        edges.push({ source: empId, target: orgId, label: 'belongsTo' })
      }

      const profession = row['profession'] || row['planned_profession'] || row['planned_position'] || ''
      if(profession){
        const profId = `prof:${profession}`
        ensureNode(profId, `Profession ${profession}`, 'Profession')
        edges.push({ source: empId, target: profId, label: 'profession' })
      }

      const coordinator = row['coordinator_group_id'] || row['coordinator group id'] || ''
      if(coordinator){
        const coordId = `coord:${coordinator}`
        ensureNode(coordId, `Coordinator ${coordinator}`, 'Coordinator')
        edges.push({ source: empId, target: coordId, label: 'coordinatorGroup' })
      }

      const eduField = row['education_field'] || row['education_field_name'] || row['field_of_study_name'] || ''
      if(eduField){
        const eduId = `edu:${eduField}`
        ensureNode(eduId, `Education ${eduField}`, 'Education')
        edges.push({ source: empId, target: eduId, label: 'education' })
      }
    }

    // Degreed-like rows: content id -> skills, completion data
    const contentId = row['content id'] || row['contentid'] || row['content_id'] || ''
    if(contentId){
      const contentNode = `content:${contentId}`
      ensureNode(contentNode, `Content ${contentId}`, 'Content')

      const completion = row['completed date'] || row['completion date'] || row['completeddate'] || ''
      if(completion){
        const evId = `event:${contentId}:${completion}`
        ensureNode(evId, `Event ${completion}`, 'Event')
        edges.push({ source: contentNode, target: evId, label: 'event' })
      }

      // skills columns: skill 1..15 or skill_1
      const skillCols = headers.filter(h=>/^skill\s*\d+|^skill_\d+/i.test(h) || h.startsWith('skill '))
      skillCols.forEach(k=>{
        const sk = row[k]
        if(sk){
          const skId = `skill:${sk}`
          ensureNode(skId, sk, 'Skill')
          edges.push({ source: contentNode, target: skId, label: 'develops' })
        }
      })
    }

    // Skill mapping rows (mapping courses to skills)
    const mappingCourse = row['course id'] || row['object id'] || row['idobj'] || ''
    const mappedSkill = row['skill id'] || row['skillid'] || row['skill name'] || ''
    if(mappingCourse && mappedSkill){
      const courseN = `content:${mappingCourse}`
      const skillN = `skill:${mappedSkill}`
      ensureNode(courseN, `Content ${mappingCourse}`, 'Content')
      ensureNode(skillN, mappedSkill, 'Skill')
      edges.push({ source: courseN, target: skillN, label: 'mapsTo' })
    }

    // Qualifications / required qualifications rows
    const qualId = row['qualification id'] || row['id q'] || row['idq'] || ''
    if(qualId){
      const qn = `qual:${qualId}`
      ensureNode(qn, `Qualification ${qualId}`, 'Qualification')
      // link to employee
      if(personal) edges.push({ source: `emp:${personal}`, target: qn, label: 'hasQualification' })
      // link to position if present
      const plannedPos = row['planned_position_id'] || row['planned position id'] || ''
      if(plannedPos) edges.push({ source: `pos:${plannedPos}`, target: qn, label: 'requires' })
    }
  })

  return { nodes: Array.from(nodesMap.values()), edges }
}
