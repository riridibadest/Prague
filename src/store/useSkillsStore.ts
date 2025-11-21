import create from 'zustand'
import { skills as mockSkills } from '../services/mockData'

type State = {
  skills: typeof mockSkills
}

export const useSkillsStore = create<State>(() => ({
  skills: mockSkills
}))
