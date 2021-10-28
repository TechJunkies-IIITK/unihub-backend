const UserSchema = require('../models/userdetails')
const RoomSchema = require('../models/roomschema')
const { hashSync } = require('bcrypt')
const { uid } = require('uid/secure')
const getUid = require('get-uid')

async function addUser(name,email,phone,password,profileLink){
    let added
    await UserSchema.create({
        name,
        email,
        phone,
        password: hashSync(password, 12),
        profileLink,
        userID: getUid()
    },(err,data)=>{
        if(data)added=true
    })
    return added===true
}

async function getUserDetailsByEmail(email){
    return await UserSchema.findOne({email})
}

async function getUserDetailsByPhone(phone){
    return await UserSchema.findOne({phone})
}

async function createHub(adminId,hubName,hubTopic,isPublic,hubCode,users){
    let created = false
    await RoomSchema.create({
        adminId,
        hubName,
        hubID : uid(12),
        hubTopic,
        hubCode : isPublic ? '' : uid(6),
        isPublic,
        users
    },(err,data)=>{
        if(data)created=true
    })
    return created
}

async function addUserToHub(hubID,userID){
    const hub = await RoomSchema.findOne({hubID})
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
    const hub = await RoomSchema.findOne({hubID})
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
    let hubs = []
    await RoomSchema.find({
        isPublic:true
    },(err,data)=>{
        if(data)hubs = data
    })
    return hubs
}

async function getHubDetailsByCode(hubCode){
    return await RoomSchema.findOne({hubCode})
}

async function getHubDetailsByName(hubName){
    return await RoomSchema.findOne({hubName})
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