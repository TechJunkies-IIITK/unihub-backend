const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/config')

function createToken(userID){
    return jwt.sign({userID},SECRET,{expiresIn: '7d'})
}

function verifyToken(token,userID){
    let verified=false
    jwt.verify(token, SECRET,(err,data)=>{
        if(data){
            verified = userID === data.userID
        }
    })
    return verified
}

module.exports = {
    createToken,
    verifyToken
}