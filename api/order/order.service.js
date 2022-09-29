const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy) {
    console.log('filterBy order', filterBy);

    try {
        let criteria = {}
        if (filterBy) criteria = _buildCriteria(filterBy);
        console.log('order criteria', criteria);
        const collection = await dbService.getCollection('order');
        const orders = await collection.find(criteria).toArray() || [];
        return orders;
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        newOrder = {
            ...order,
            createdAt: Date.now()
        }
        const collection = await dbService.getCollection('order')
        await collection.insertOne(newOrder)
        return newOrder
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    console.log(order);
    try {
        const orderToSave = {
            ...order,
            _id: ObjectId(order._id)
        }
        // delete savedOrder._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: orderToSave._id }, { $set: orderToSave })
        return orderToSave
    } catch (err) {
        logger.error(`cannot update order ${orderToSave_id}`, err)
        throw err
    }
}




function _buildCriteria(filterBy) {
    const { sellerId } = filterBy;
    let criteria = {};
    if (sellerId) {
        criteria = { 'seller._id': sellerId };
    }
    // if (txt) {
    //     console.log('im here!');
    //     criteria.name = { $regex: txt, $options: 'i' };
    // }
    // if (inStock === 'instock') {
    //     criteria.inStock = true;
    // } else if (inStock === 'outofstock') {
    //     criteria.inStock = false;
    // }
    // if (labels.length) {
    //     criteria.labels = { $all: labels }
    // }
    console.log('criteria:', criteria);
    return criteria

}

function _getLabelsByOrders(orders) {
    if (!orders) return;
    let labels = [];
    orders.forEach(order => {
        order.labels.forEach(labelFromOrder => {
            if (labels.some(label => label === labelFromOrder)) return;
            labels.push(labelFromOrder)
        })
    })

    return Promise.resolve(labels)

}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}