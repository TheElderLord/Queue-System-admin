/* eslint-disable no-undef */
const express = require('express')
const path = require('path')

const app = express()

// Absolute path to the dist directory outside the project folder
const distPath = path.join(__dirname, '..', 'dist')

// Serve static files from the dist directory
app.use(express.static(distPath))

// Handle SPA fallback after static and API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const appPort = 5173
app.listen(appPort, () => {
  console.log(`Server listening on port ${appPort}`)
})
