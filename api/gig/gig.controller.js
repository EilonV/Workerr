const gigService = require('./gig.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getGigs(req, res) {
  try {
    logger.debug('Getting Gigs')
    var queryParams = req.query
    console.log('hear', queryParams);
    const Gigs = await gigService.query(queryParams)
    res.json(Gigs)
  } catch (err) {
    logger.error('Failed to get Gigs', err)
    res.status(500).send({ err: 'Failed to get Gigs' })
  }
}

// GET BY ID 
async function getGigById(req, res) {
  try {
    const GigId = req.params.id
    const Gig = await gigService.getById(GigId)
    res.json(Gig)
  } catch (err) {
    logger.error('Failed to get Gig', err)
    res.status(500).send({ err: 'Failed to get Gig' })
  }
}

// POST (add Gig)
async function addGig(req, res) {
  try {
    const Gig = req.body
    const addedGig = await gigService.add(Gig)
    res.json(addedGig)
  } catch (err) {
    logger.error('Failed to add Gig', err)
    res.status(500).send({ err: 'Failed to add Gig' })
  }
}

// PUT (Update Gig)
async function updateGig(req, res) {
  try {
    const Gig = req.body;
    const updatedGig = await gigService.update(Gig)
    res.json(updatedGig)
  } catch (err) {
    logger.error('Failed to update Gig', err)
    res.status(500).send({ err: 'Failed to update Gig' })

  }
}

// DELETE (Remove Gig)
async function removeGig(req, res) {
  try {
    const GigId = req.params.id;
    const removedId = await gigService.remove(GigId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove Gig', err)
    res.status(500).send({ err: 'Failed to remove Gig' })
  }
}

module.exports = {
  getGigs,
  getGigById,
  addGig,
  updateGig,
  removeGig
}
