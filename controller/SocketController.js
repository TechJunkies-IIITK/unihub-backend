const { 
    getHubDetailsByName,
    getHubDetailsByCode,
    addUserToHub,
    removeUserFromHub,
    createHub,
    getPublicHubs
} = require('./DatabaseController')
const { createAgoraToken } = require('./JwtController')

function join(socket) {
    socket.on('join',async(data)=>{
        const { isPublic, hubName, hubCode} = data
        const uid = socket.handshake.auth.userID
        if(isPublic){
            if(hubName){
                const hub = await getHubDetailsByName(hubName)
                if(hub){
                    const token = createAgoraToken(hub.hubID, uid)
                    socket.emit('join-res',{
                        message: 'success',
                        token,
                        hubName
                    })
                    addUserToHub(hub.hubID,uid)
                    socket.hubName = hubName
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
                    const token = createAgoraToken(hub.hubID, uid)
                    socket.emit('join-res',{
                        message: 'success',
                        token,
                        hubName: hub.hubName
                    })
                    socket.hubName = hubName
                    addUserToHub(hub.hubID,uid)
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
        const { hubName } = data
        const uid = socket.handshake.auth.userID
        if(hubName){
            const hub = await getHubDetailsByName(hubName)
            if(hub){
                const removed = await removeUserFromHub(hub.hubID,uid)
                if(removed){
                    return socket.emit('leave-res',{message:'success'})
                }
            }
        }
        socket.emit('leave-res',{message:'failure'})
    })
}

function create(socket) {
    socket.on('create',async(data)=>{
        const { hubName, isPublic, hubTopic } = data
        const uid = socket.handshake.auth.userID
        if(hubName && (isPublic !== undefined && isPublic !==null) ){
            const hub = await createHub(uid,hubName,hubTopic,
                isPublic,[])
                await addUserToHub(hub.hubID,uid)
                return socket.emit('create-res',{
                    message:'success',
                    hubID:hub.hubID,
                    hubCode:hub.hubCode,
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
    create
}