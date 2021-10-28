const UserSchema = require('../models/userdetails')
const RoomSchema = require('../models/roomschema')
const { hashSync } = require('bcrypt')
const { uid } = require('uid/secure')
const getUid = require('get-uid')

async function addUser(name,email,phone,passsword,profileLink){
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
    return added
}

function deleteUser(email,phone){
    UserSchema.deleteOne({
        email,
        phone,
    },(err)=>{
        //user not found
    });
}

function createHub(adminId,hubName,hubTopic,isPublic,hubCode,users){
    let created
    await RoomSchema.create({
        adminId,
        hubName,
        hubID = uid(12),
        hubTopic,
        hubCode : isPublic ? '' : uid(6),
        isPublic,
        users
    },(err,data)=>{
        if(data)created=true
    })
    return created
}

async function addUserToHub(hubID,name,userID){
    const hub = await RoomSchema.findOne({hubID})
    if(hub!=null){
        hub.users.push({
            name,
            userID,
            profileLink
        })
        hub.save()
    } 
}

async function removeUserFromHub(hubID,userID){
    const hub = await RoomSchema.findOne({hubID})
    if(hub!=null){
        const index = hub.users.findIndex((e)=>e.userID === userID)
        hub.users.spice(index,1)
        hub.save()
    } 
}

async function getPublicHubs(){
    return await RoomSchema.find({
        isPublic:true
    })
}

async function getHubDetailsByCode(hubCode){
    return RoomSchema.findOne({hubCode})
}

async function getHubDetailsByName(hubName){
    return RoomSchema.findOne({hubName})
}