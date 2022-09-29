const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
// const { log } = require('../../middlewares/logger.middleware')
const { getGigs, getGigById, addGig, updateGig, removeGig, addReview } = require('./gig.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getGigs)
router.get('/:id', getGigById)
router.post('/', requireAuth, addGig)
router.put('/:id', requireAuth, updateGig)
router.delete('/:id', requireAuth, requireAdmin, removeGig)

module.exports = router