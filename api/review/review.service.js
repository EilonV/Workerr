const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
        // const reviews = await collection.find().toArray()
        // const reviews = await collection.find(criteria).toArray()

        // Only for our demonstration!
        // review = {
        //     "_id": ObjectId("6283f0062e78c344ac1fef1c"),
        //     "userId" : ObjectId("6283ef022e78c344ac1fef19"),
        //     "toyId" : ObjectId("6283efc12e78c344ac1fef1a"),
        //     "txt": "Nice doll",
        // }
        // review = {
        //     "_id": ObjectId("6283f0062e78c344ac1fef1c"),
        //     "userId" : ObjectId("6283ef022e78c344ac1fef19"),
        //     "toyId" : ObjectId("6283efc12e78c344ac1fef1a"),
        //     "user" : {
        //         "_id": ObjectId("6283ef022e78c344ac1fef19"),
        //         "fullname": "Ori yo",
        //         "score": 70,
        //     },
        //     "toy" : {
        //         "name": "Nahum",
        //         "price": 4.0,
        //         "inStock": true,
        //         "labels": [
        //             "Box game",
        //             "Baby"
        //         ],
        //     },
        //     "txt": "Nice doll",
        // }
        // user = {
        //     "_id": ObjectId("6283ef022e78c344ac1fef19"),
        //     "username": "oriyo",
        //     "password": "$2b$10$1fN5ttuJk76Poy6Ang6yKuv3i/CrXk6ozTYIB1DRI.MtGH4whFbca",
        //     "fullname": "Ori yo",
        //     "score": 70,
        //     "isAdmin": false
        // }
        // toy =  {
        //     "name": "Nahum",
        //     "price": 4.0,
        //     "inStock": true,
        //     "createdAt": 1662657467000.0
        // }

        let reviews = await collection.aggregate([
            {
                // Filter inside aggregation
                $match: criteria
            },
            {
                // Go fetch
                $lookup:

                {
                    // Specify the field name inside each local item (review)
                    // to search for in the foreign collection (user)
                    localField: 'toyId',
                    
                    // The "foreign" collection name to fetch from
                    from: 'toy',
                    
                    // Specify the field name in the foriegn (user) collection ->
                    // only the matching ones will be inserted to the review.
                    foreignField: '_id',
                    
                    // Specify the field name that will be inserted 
                    // and passing a value of the matching user obj.(AS AN ARRAY)
                    as: 'toy'
                }
            },
            {
                // Flatten array to an object -!!!
                // (done ONLY when WE KNOW there's only one item found to be found)
                $unwind: '$toy'
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'users',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]).toArray()
        reviews = reviews.map(review => {
            review.user = { _id: review.user._id, fullname: review.user.fullname }
            review.toy = { _id: review.toy._id, name: review.toy.name, price: review.toy.price }
            review.createdAt = ObjectId(review._id).getTimestamp()
            delete review.byUserId
            delete review.toyId
            return review
        })

        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(reviewId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {
        const reviewToAdd = {
            byUserId: ObjectId(review.byUserId),
            toyId: ObjectId(review.toyId),
            txt: review.txt
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = ObjectId(filterBy.byUserId)
    if (filterBy.toyId) criteria.toyId = ObjectId(filterBy.toyId)
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


