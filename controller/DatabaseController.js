const UserSchema = require('../models/userdetails')
const HubSchema = require('../models/hubschema')
const { hashSync } = require('bcrypt')
const { uid } = require('uid/secure')
const getUid = require('get-uid')

async function addUser(name,email,phone,password,profileLink){
    const user = new UserSchema({
        name,
        email,
        phone,
        password: hashSync(password, 12),
        profileLink,
        userID: getUid()
    })
    await user.save()
    return user
}

async function getUserDetailsByEmail(email){
    return await UserSchema.findOne({email})
}

async function getUserDetailsByPhone(phone){
    return await UserSchema.findOne({phone})
}

async function getUserDetailsByPhone(userID){
    return await UserSchema.findOne({userID})
}

async function createHub(adminId,hubName,hubTopic,isPublic,users){
    const hub = new HubSchema({
        adminId,
        hubName,
        hubID : uid(12),
        hubTopic,
        hubCode : isPublic ? '' : uid(6),
        isPublic,
        users
    })
    await hub.save()
    return hub
}

async function addUserToHub(hubID,userID){
    const hub = await HubSchema.findOne({hubID})
    const user = await UserSchema.findOne({userID})
    if(hub && user){
        hub.users.push({
            name: user.name,
            userID,
            profileLink: user.profileLink
        })
        hub.save()
        return true
    } else{
        return false
    }
}

async function removeUserFromHub(hubID,userID){
    const hub = await HubSchema.findOne({hubID})
    if(hub!=null){
        const index = hub.users.findIndex((e)=>e.userID === userID)
        hub.users.spice(index,1)
        hub.save()
        return true
    } else{
        return false
    }
}

async function getPublicHubs(){
    return await HubSchema.find({
        isPublic:true
    }).select('-_id -__v')
}

async function getHubDetailsByCode(hubCode){
    return await HubSchema.findOne({hubCode})
}

async function getHubDetailsByName(hubName){
    return await HubSchema.findOne({hubName})
}

module.exports = {
    addUser,
    getUserDetailsByEmail,
    getUserDetailsByPhone,
    createHub,
    addUserToHub,
    removeUserFromHub,
    getHubDetailsByCode,
    getHubDetailsByName,
    getPublicHubs
}