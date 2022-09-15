const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
        return toyId
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        const addedToy = await collection.insertOne(toy)
        return addedToy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}
async function update(toy) {
    try {
        var id = ObjectId(toy._id)
        delete toy._id
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: id }, { $set: { ...toy } })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${id}`, err)
        throw err
    }
}
function _buildCriteria({ inStock, label, name }) {
    const criteria = {}
    inStock = JSON.parse(inStock)
    if (name) {
        const regex = new RegExp(name, 'i')
        criteria.name = { $regex: regex }
    }
    if (inStock) {
        criteria.inStock = true
    }
    if (label) {
        criteria.labels = { $in: [label] }
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