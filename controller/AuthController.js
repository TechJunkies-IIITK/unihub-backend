const logIn = (socket)=>{
    socket.on('/login',(data)=>{
        console.log('Log In')
    })
}
const signUp = (socket)=>{
    socket.on('/signup',(data)=>{
        console.log('Sign Up')
    })
}

module.exports = {
    logIn,
    signUp
}