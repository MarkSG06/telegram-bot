const express = require('express')
const app = express()
const userTrackingMiddleware = require('./middlewares/user-tracking')
const errorHandler = require('./middlewares/error-handler')
const userAgentMiddleware = require('./middlewares/user-agent')
const routes = require('./routes')

// Antes de cargar
app.use(express.json({ limit: '10mb', extended: true }))
app.use(userTrackingMiddleware)
app.use(userAgentMiddleware)

// Despues de cargar
app.use('/api', routes)
app.use(errorHandler)

module.exports = app
