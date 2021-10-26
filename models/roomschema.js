const {Schema , model} = require('mongoose')

const HubSchema = new Schema({
    adminId : Number,
    hubName : String,
    hubID : String,
    hubTopic : String,
    hubCode: {
        type: String,
        default: ''
    },
    isPublic : Boolean,
    users : []
})

module.exports = model('hubshcema',HubSchema)