const express = require('express')
const app = express()
const userTrackingMiddleware = require('./middlewares/user-tracking')
const errorHandler = require('./middlewares/error-handler')
const userAgentMiddleware = require('./middlewares/user-agent')
const routes = require('./routes')
const IORedis = require('ioredis')
const redisClient = new IORedis(process.env.REDIS_URL)
const subscriberClient = new IORedis(process.env.REDIS_URL)
require('./events')(redisClient, subscriberClient)

app.use((req, res, next) => {
  req.redisClient = redisClient
  next()
})

// Antes de cargar
app.use(express.json({ limit: '10mb', extended: true }))
app.use(userTrackingMiddleware)
app.use(userAgentMiddleware)

// Despues de cargar
app.use('/api', routes)
app.use(errorHandler)

module.exports = app
