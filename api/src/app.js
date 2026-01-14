const express = require('express')
const app = express()
const userTrackingMiddleware = require('./middlewares/user-tracking')
const errorHandler = require('./middlewares/error-handler')
const userAgentMiddleware = require('./middlewares/user-agent')
const routes = require('./routes')
const exposeServiceMiddleware = require('./middlewares/expose-services')

const { createClient } = require('redis')
const redisClient = createClient({ url: process.env.REDIS_URL })
redisClient.connect().catch(console.error)
const subscriberClient = redisClient.duplicate()
subscriberClient.connect().catch(console.error)
require('./events')(redisClient, subscriberClient)

app.use((req, res, next) => {
  req.redisClient = redisClient
  next()
})

// Antes de cargar
app.use(express.json({ limit: '10mb', extended: true }))
app.use(userTrackingMiddleware)
app.use(userAgentMiddleware)
app.use(...Object.values(exposeServiceMiddleware))

// Despues de cargar
app.use('/api', routes)
app.use(errorHandler)

module.exports = app
