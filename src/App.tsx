import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import UploadSimulator from './pages/UploadSimulator'
import Header from './components/Header'
import ChatLauncher from './components/ChatLauncher'

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/employee" element={<EmployeeDashboard/>} />
          <Route path="/manager" element={<ManagerDashboard/>} />
          <Route path="/upload" element={<UploadSimulator/>} />
        </Routes>
      </main>
      <ChatLauncher />
    </div>
  )
}
