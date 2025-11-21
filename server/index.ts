import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const port = process.env.PORT || 3001

const apiKey = process.env.OPENAI_API_KEY || ''
if(!apiKey){
  console.warn('No OPENAI_API_KEY set in environment — server will still run but calls will fail')
}

const client = new OpenAI({ apiKey: apiKey })

app.post('/api/ask', async (req, res) => {
  try{
    const { prompt } = req.body
    if(!prompt) return res.status(400).json({ error: 'missing prompt' })

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'You are a concise Performance Analyst. Produce structured bulleted skill assessment summaries for given employee JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.2
    })

    const content = response?.choices?.[0]?.message?.content || response?.choices?.[0]?.text || JSON.stringify(response)
    res.json({ result: content })
  }catch(err:any){
    console.error('server /api/ask error', err.message || err)
    res.status(500).json({ error: String(err.message || err) })
  }
})

app.get('/api/ping', (req,res)=>{
  res.json({ ok: true, provider: 'openai-proxy' })
})

app.listen(port, ()=>{
  console.log(`LLM proxy server running on http://localhost:${port}`)
})
