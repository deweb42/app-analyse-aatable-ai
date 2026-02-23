import express from 'express'
import path from 'path'
import 'dotenv/config'
import router from './routes.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(express.json({ limit: '10mb' }))
app.use(router)

// In production, serve the built frontend
if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(import.meta.dirname, '../dist')
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
