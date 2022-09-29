const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getOrders, getOrderById, addOrder, updateOrder, removeOrder, getLabels } = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/labels', getLabels)

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.post('/', requireAuth, addOrder)
router.put('/:id', requireAuth, updateOrder)
// router.post('/', requireAuth, requireAdmin, addOrder)
// router.put('/:id', requireAuth, requireAdmin, updateOrder)
router.delete('/:id', requireAuth, requireAdmin, removeOrder)

module.exports = router