import create from 'zustand'
import { employees as mockEmployees } from '../services/mockData'

type State = {
  employees: typeof mockEmployees
  assignCourse: (employeeId:string, courseId:string) => void
  unassignCourse: (employeeId:string, courseId:string) => void
}

export const useEmployeeStore = create<State>(set => ({
  employees: mockEmployees,
  assignCourse: (employeeId, courseId) => set(state => ({
    employees: state.employees.map(e => e.id === employeeId ? ({...e, assignedCourses: Array.from(new Set([...(e.assignedCourses||[]), courseId]))}) : e)
  })),
  unassignCourse: (employeeId, courseId) => set(state => ({
    employees: state.employees.map(e => e.id === employeeId ? ({...e, assignedCourses: (e.assignedCourses||[]).filter(c=>c!==courseId)}) : e)
  }))
}))
