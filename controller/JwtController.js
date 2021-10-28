const jwt = require('jsonwebtoken')
const { SECRET, APP_ID, APP_CERTIFICATE } = require('../config/config')
const { RtcRole, RtcTokenBuilder } = require('agora-access-token')
const expirationTimeInSeconds = 3600 * 24
const currentTimestamp = Math.floor(Date.now() / 1000)
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
const role = RtcRole.PUBLISHER

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

function createAgoraToken(channelName,userID) {
    return RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,
        userID,role,privilegeExpiredTs)
}

module.exports = {
    createToken,
    verifyToken,
    createAgoraToken
}