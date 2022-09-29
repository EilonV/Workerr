const orderService = require('./order.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getOrders(req, res) {
  // console.log('in server', req);
  try {
    let filterBy = req.query;
    // if (filterBy) filterBy = JSON.parse(filterBy)
    // console.log('filterBy in getOrders', filterBy);
    const orders = await orderService.query(filterBy)
    res.json(orders);
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}

// GET BY ID 
async function getOrderById(req, res) {
  console.log(req);
  try {
    const orderId = req.params.id;
    console.log(orderId);
    const order = await orderService.getById(orderId)
    res.json(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(500).send({ err: 'Failed to get order' })
  }
}

// POST (add order)
async function addOrder(req, res) {
  try {
    const order = req.body;
    const addedOrder = await orderService.add(order)
    res.json(addedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}

// PUT (Update order)
async function updateOrder(req, res) {
  // console.log('order', req.body);

  try {
    const order = req.body;
    const updatedOrder = await orderService.update(order)
    res.json(updatedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })

  }
}

// DELETE (Remove order)
async function removeOrder(req, res) {
  try {
    const orderId = req.params.id;
    await orderService.remove(orderId)
    res.send({ msg: 'Delete Successfully' })
  } catch (err) {
    logger.error('Failed to remove order', err)
    res.status(500).send({ err: 'Failed to remove order' })
  }
}

// async function getLabels(req, res) {
//   console.log('im here!');
//   try {
//     const labels = await orderService.getLabels()
//     res.send(labels)
//   } catch (err) {
//     logger.error('Failed to get Labels', err)
//     res.status(500).send({ err: 'Failed to get Labels' })
//   }
// }

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder,
  // getLabels
}
