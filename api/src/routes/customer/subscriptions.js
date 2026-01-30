const express = require('express')
const router = express.Router()
const subscriptionController = require('../../controllers/customer/subscription-controller.js')

router.post('/', subscriptionController.create)

module.exports = router
