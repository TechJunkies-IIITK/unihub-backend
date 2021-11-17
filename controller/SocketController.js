const { 
    getHubDetailsByID,
    getHubDetailsByCode,
    addUserToHub,
    removeUserFromHub,
    createHub,
    getPublicHubs,
    removeHubByID
} = require('./DatabaseController')
const { createAgoraToken } = require('./JwtController')
const connections = {}

function join(socket) {
    socket.on('join',async(data)=>{
        const { isPublic, hubID, hubCode} = data
        const uid = Number(socket.handshake.headers.userid)
        if(isPublic){
            if(hubID){
                const hub = await getHubDetailsByID(hubID)
                if(hub){
                    await addUserToHub(hub.hubID,uid)
                    connections[socket.id] = {}
                    connections[socket.id].hubID = hub.hubID
                    const token = createAgoraToken(hub.hubID, uid)
                    await socket.join([hub.hubID])
                    const updatedHub = await getHubDetailsByID(hubID)
                    socket.emit('join-res',{
                        message: 'success',
                        token,
                        hubName: hub.hubName,
                        hubID: hub.hubID,
                        hubTopic: hub.hubTopic,
                        hubCode: hub.hubCode,
                        users: updatedHub.users,
                    })
                    socket.broadcast.to(hub.hubID).emit('update',{
                        message: 'success',
                        users: updatedHub.users,
                    })
                }else{
                    socket.emit('join-res',{
                        message : 'no hub with given name exists'
                    })
                }
            }else{
                socket.emit('join-res',{
                    message : 'Invalid credentials'
                })
            }
        }else{
            if(hubCode ){
                const hub = await getHubDetailsByCode(hubCode)
                if(hub){
                    connections[socket.id] = {}
                    connections[socket.id].hubID = hub.hubID
                    await addUserToHub(hub.hubID,uid)
                    const token = createAgoraToken(hub.hubID, uid)
                    await socket.join([hub.hubID])
                    const updatedHub = await getHubDetailsByCode(hubCode)
                    socket.emit('join-res',{
                        message: 'success',
                        token,
                        hubName: hub.hubName,
                        hubID: hub.hubID,
                        hubTopic: hub.hubTopic,
                        hubCode: hub.hubCode,
                        users: updatedHub.users,
                    })
                    socket.broadcast.to(hub.hubID).emit('update',{
                        message: 'success',
                        users: updatedHub.users,
                    })
                }else{
                    socket.emit('join-res',{
                        message : 'No room with given code exists'
                    })
                }
            }else{
                socket.emit('join-res',{
                    message : 'Please provide a valid code'
                })
            }
        }
    })
}

function leave(socket) {
    socket.on('leave',async(data)=>{
        const hubID = connections[socket.id] ? connections[socket.id].hubID : null
        const uid = Number(socket.handshake.headers.userid)
        if(hubID){
            const hub = await getHubDetailsByID(hubID)
            if(hub){
                socket.leave(hubID)
                const removed = await removeUserFromHub(hub.hubID,uid)
                if(hub.users.length <= 1){
                    removeHubByID(hub.hubID)
                }
                try{
                    delete connections[socket.id]
                }catch(err){};
                const updatedHub = await getHubDetailsByID(hubID)
                socket.emit('leave-res',{message:'success'})
                socket.broadcast.to(hub.hubID).emit('update',{
                    message: 'success',
                    users: updatedHub.users || [],
                })
            }else{
                socket.emit('leave-res',{message:'No such HUB'})
            }
        }
        socket.emit('leave-res',{message:'failure'})
    })
}

function create(socket) {
    socket.on('create',async(data)=>{
        const { hubName, isPublic, hubTopic } = data
        const uid = Number(socket.handshake.headers.userid)
        if(hubName && (isPublic !== undefined && isPublic !==null) ){
            const hub = await createHub(uid,hubName,hubTopic,
                isPublic,[])
                connections[socket.id] = {}
                connections[socket.id].hubID = hub.hubID
                await addUserToHub(hub.hubID,uid)
                await socket.join([hub.hubID])
                const updatedHub = await getHubDetailsByID(hub.hubID)
                return socket.emit('create-res',{
                    message:'success',
                    hubName: hub.hubName,
                    hubID: hub.hubID,
                    hubTopic: hub.hubTopic,
                    users: updatedHub.users,
                    hubCode: hub.hubCode,
                    token:createAgoraToken(hub.hubID, uid)
                })
        }
        socket.emit('create-res',{message:'failure'})
    })
}

function publicHubs(socket) {
    socket.on('public',async(data)=>{
        socket.emit('public-res',{
            message: 'success',
            hubs : await getPublicHubs()
        })
    })
}

module.exports = {
    publicHubs,
    join,
    leave,
    create,
    connections
}