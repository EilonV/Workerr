const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('gig')
        var gigs = await collection.find(criteria).toArray()
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ _id: ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ _id: ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function add(gig) {
    try {
        const collection = await dbService.getCollection('gig')
        const addedgig = await collection.insertOne(gig)
        return addedgig
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}
async function update(gig) {
    try {
        var id = ObjectId(gig._id)
        delete gig._id
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: id }, { $set: { ...gig } })
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${id}`, err)
        throw err
    }
}
function _buildCriteria({ title, tags, }) {
    const criteria = {}
   console.log(typeof tags);
    if (title) {
        const regex = new RegExp(title, 'i')
        criteria.title = { $regex: regex }
    }
 
    if (tags?.length) {
        criteria.tags = { $all: tags }

    }
    return criteria

}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}