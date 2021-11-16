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
                    connections[socket.id].hubID = hub.hubID
                    const token = createAgoraToken(hub.hubID, uid)
                    socket.join([hub.hubID])
                    socket.emit('join-res',{
                        message: 'success',
                        token,
                        hubName: hub.hubName,
                        hubID: hub.hubID,
                        hubTopic: hub.hubTopic,
                        hubCode: hub.hubCode,
                        users: hub.users,
                    })
                    socket.broadcast.to(hub.hubID).emit('update',{
                        message: 'success',
                        users: hub.users,
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
                    connections[socket.id].hubID = hub.hubID
                    await addUserToHub(hub.hubID,uid)
                    const token = createAgoraToken(hub.hubID, uid)
                    socket.join([hub.hubID])
                    socket.emit('join-res',{
                        message: 'success',
                        token,
                        hubName: hub.hubName,
                        hubID: hub.hubID,
                        hubTopic: hub.hubTopic,
                        hubCode: hub.hubCode,
                        users: hub.users,
                    })
                    socket.broadcast.to(hub.hubID).emit('update',{
                        message: 'success',
                        users: hub.users,
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
                delete connections[socket.id]
                socket.emit('leave-res',{message:'success'})
                socket.broadcast.to(hub.hubID).emit('update',{
                    message: 'success',
                    users: hub.users || [],
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
                connections[socket.id].hubID = hub.hubID
                console.log(connections)
                await addUserToHub(hub.hubID,uid)
                socket.join([hub.hubID])
                return socket.emit('create-res',{
                    message:'success',
                    hubName: hub.hubName,
                    hubID: hub.hubID,
                    hubTopic: hub.hubTopic,
                    users: hub.users,
                    hubCode: hub.hubCode,
                    token:createAgoraToken(hub.hubID, uid)
                })
        }
        socket.emit('create-res',{message:'failure'})
    })
}

function publicHubs(socket) {
    console.log(connections[socket.id].hubID)
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