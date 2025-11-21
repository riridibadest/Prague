import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing(){
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-7 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold leading-tight">AI Skill Coach — Map, Grow, and Mobilize Talent</h1>
        <p className="mt-4 text-slate-300 max-w-xl">A premium prototype for enterprise skill management: career paths, skill gaps, team insights, and AI-powered learning suggestions.</p>
        <div className="mt-6 flex items-center gap-4">
          <Link to="/employee" className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg">Enter as Employee</Link>
          <Link to="/manager" className="px-6 py-3 rounded-lg bg-slate-800 text-slate-200">Enter as Manager</Link>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="card">Career Paths<br/><div className="text-slate-400 text-sm">Explore role maps</div></div>
          <div className="card">Skill Catalog<br/><div className="text-slate-400 text-sm">Organize competencies</div></div>
          <div className="card">AI Coach<br/><div className="text-slate-400 text-sm">Personalized recommendations</div></div>
        </div>
      </div>
      <div className="col-span-5">
        <motion.div initial={{scale:0.98, opacity:0}} animate={{scale:1, opacity:1}} className="card h-full flex items-center justify-center">
          <div className="w-full h-80 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300">
            {/* Placeholder for Lottie */}
            <div className="text-center">
              <div className="text-2xl font-semibold">[Lottie Animation]</div>
              <div className="text-sm text-slate-400 mt-2">Animated career map</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
