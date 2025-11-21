import { Skill, Employee, Course } from './mockData'
import { AZURE_API_KEY, AZURE_ENDPOINT, AZURE_DEPLOYMENT } from '../config/azureConfig'

export interface AIResponse {
  inferredSkills: { skillId:string; confidence:number }[]
  suggestedRoles: { id:string; name:string; fitScore:number }[]
  recommendedCourses: { id:string; title:string; relevance:number }[]
}

const sleep = (ms:number)=> new Promise(res=>setTimeout(res, ms))

export async function askMock(message: string): Promise<string>{
  await sleep(700 + Math.random()*800)
  return `Mock Analysis:\n- inferred skills: React, TypeScript\n- suggested courses: Advanced React Patterns | TypeScript Deep Dive`;
}

async function sleepMs(ms:number){ return new Promise(res=>setTimeout(res, ms)) }

async function callAzureChat(endpoint:string, deployment:string, apiKey:string, prompt:string){
  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=2023-10-01`
  const body = {
    messages: [
      { role: 'system', content: 'You are a concise Performance Analyst. Produce structured bulleted skill assessment summaries for given employee JSON.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1000,
    temperature: 0.2
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(body)
  })
  if(!res.ok){
    const txt = await res.text()
    throw new Error(`Azure error ${res.status}: ${txt}`)
  }
  const data = await res.json()
  // Azure Chat response structure: choices[0].message.content
  const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || JSON.stringify(data)
  return content
}

export async function askLLM(message: string): Promise<string>{
  // Decide whether to use Azure (if configured in code or localStorage) else mock
  const apiKey = AZURE_API_KEY && AZURE_API_KEY !== 'REPLACE_WITH_YOUR_AZURE_KEY' ? AZURE_API_KEY : (typeof window !== 'undefined' ? localStorage.getItem('ai_api_key') : null)
  const endpoint = AZURE_ENDPOINT && AZURE_ENDPOINT !== 'https://YOUR_AZURE_OPENAI_RESOURCE.openai.azure.com' ? AZURE_ENDPOINT : (typeof window !== 'undefined' ? localStorage.getItem('ai_azure_endpoint') : null)
  const deployment = AZURE_DEPLOYMENT && AZURE_DEPLOYMENT !== 'YOUR_DEPLOYMENT_NAME' ? AZURE_DEPLOYMENT : (typeof window !== 'undefined' ? localStorage.getItem('ai_azure_deployment') : null)

  if(apiKey && endpoint && deployment){
    // exponential backoff
    const delays = [1000,2000,4000]
    let lastErr: any = null
    for(let attempt=0; attempt<delays.length; attempt++){
      try{
        const result = await callAzureChat(endpoint, deployment, apiKey, message)
        return result
      }catch(err){
        lastErr = err
        await sleepMs(delays[attempt])
      }
    }
    throw lastErr
  }

  // If no Azure config try the local proxy server
  try{
    let res = await fetch('/api/ask', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: message })
    })
    if(!res.ok){
      // try localhost server if frontend isn't proxied
      res = await fetch('http://localhost:3001/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: message }) })
    }
    if(res.ok){
      const j = await res.json()
      return j.result
    }
  }catch(e){
    // ignore and fallback
  }

  // final fallback mock
  return askMock(message)
}
