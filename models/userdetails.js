const {Schema , model} = require('mongoose')

const UserSchema = new Schema({
    email: String,
    phone: String,
    name: String,
    userID: Number,
    password: String,
})

module.exports = model('usershcema',UserSchema)