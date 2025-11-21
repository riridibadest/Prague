export interface Skill { id:string; name:string; category?:string; level?:number }
export interface Employee { id:string; name:string; title:string; unitId?:string; skills: EmployeeSkill[]; assignedCourses?: string[] }
export interface EmployeeSkill { skillId:string; level:number }
export interface Position { id:string; name:string; professionId:string }
export interface Profession { id:string; name:string }
export interface RoleSkillRequirement { roleId:string; skillId:string; requiredLevel:number }
export interface Course { id:string; title:string; provider?:string; skillsCovered:string[] }
export interface LearningContent { id:string; title:string; url?:string; skillIds:string[] }
export interface OrganizationalUnit { id:string; name:string }

// Mock entities
export const skills:Skill[] = [
  { id:'s1', name:'React', category:'Frontend', level:3 },
  { id:'s2', name:'TypeScript', category:'Frontend', level:3 },
  { id:'s3', name:'Product Thinking', category:'Soft', level:2 },
  { id:'s4', name:'Data Analysis', category:'Data', level:2 },
  { id:'s5', name:'Leadership', category:'Management', level:1 },
  { id:'s6', name:'Machine Learning', category:'Data', level:1 }
]

export const employees:Employee[] = [
  { id:'e1', name:'Aisha Khan', title:'Frontend Engineer', unitId:'u1', skills:[{skillId:'s1',level:3},{skillId:'s2',level:2}], assignedCourses: []},
  { id:'e2', name:'Diego Alvarez', title:'Data Analyst', unitId:'u2', skills:[{skillId:'s4',level:3},{skillId:'s6',level:1}], assignedCourses: []},
  { id:'e3', name:'Maya Chen', title:'Product Manager', unitId:'u1', skills:[{skillId:'s3',level:3},{skillId:'s5',level:2}], assignedCourses: []}
]

export const positions:Position[] = [
  { id:'p1', name:'Senior Frontend Engineer', professionId:'pf1' },
  { id:'p2', name:'Data Scientist', professionId:'pf2' }
]

export const professions:Profession[] = [
  { id:'pf1', name:'Engineering' },
  { id:'pf2', name:'Data' }
]

export const roleRequirements:RoleSkillRequirement[] = [
  { roleId:'p1', skillId:'s1', requiredLevel:4 },
  { roleId:'p1', skillId:'s2', requiredLevel:4 },
  { roleId:'p1', skillId:'s3', requiredLevel:2 },
  { roleId:'p2', skillId:'s4', requiredLevel:4 },
  { roleId:'p2', skillId:'s6', requiredLevel:3 }
]

export const courses:Course[] = [
  { id:'c1', title:'Advanced React Patterns', provider:'Pluralsight', skillsCovered:['s1','s2'] },
  { id:'c2', title:'TypeScript Deep Dive', provider:'Frontend Masters', skillsCovered:['s2'] },
  { id:'c3', title:'Intro to ML', provider:'Coursera', skillsCovered:['s6'] },
  { id:'c4', title:'Product Strategy', provider:'LinkedIn Learning', skillsCovered:['s3'] }
]

export const orgUnits:OrganizationalUnit[] = [ {id:'u1', name:'Platform'}, {id:'u2', name:'Data'} ]
