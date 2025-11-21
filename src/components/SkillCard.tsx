import React from 'react'
import { motion } from 'framer-motion'

type Props = { name:string; level:number }

export default function SkillCard({name, level}:Props){
  return (
    <motion.div whileHover={{ y:-4 }} className="card w-56">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">Skill</div>
          <div className="text-lg font-semibold">{name}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Level</div>
          <div className="text-xl font-bold">{level}</div>
        </div>
      </div>
      <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div style={{width:`${(level/5)*100}%`}} className="h-full bg-gradient-to-r from-primary to-accent" />
      </div>
    </motion.div>
  )
}
