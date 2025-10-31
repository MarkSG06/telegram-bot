const express = require('express')
const find = require('../../controllers/customer/product-controller')

const router = express.Router()

router.get('/', find)

module.exports = router
