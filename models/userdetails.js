const {Schema , model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String},
    phone: {type: String},
    name: String,
    userID: {type: Number, unique:true},
    password: String,
    profileLink: String
})

module.exports = model('usershcema',UserSchema)