const { 
    getUserDetailsByEmail,
    getUserDetailsByPhone,
    addUser 
} = require('./DatabaseController')
const {createToken} = require('./JwtController')
const {hashSync,compareSync} = require('bcrypt')

const logIn = async(req,res)=>{
    // login code goes here
    const { email, phone, password } = req.body
    if(email && password){
        const user = await getUserDetailsByEmail(email)
        if(user){
            if(compareSync(password, user.password)){
                return res.send({message: 'success',userID : user.userID, token: createToken(user.userID)})
            }
        }
    }
    if(phone && password){
        const user = await getUserDetailsByPhone(phone)
        if(user){
            if(compareSync(password, user.password)){
                return res.send({message: 'success',userID : user.userID, token: createToken(user.userID)})
            }
        }
    }
    res.send({message : 'Invalid credentials'})
}
const signUp = async (req,res)=>{
    // signup code goes here
    const { name, email, phone, password, profileLink } =req.body
    if(email && password && name && profileLink){
        await addUser(name,email,'',password,profileLink)
        return res.send({message : 'success'})
    }
    if(phone && password && name && profileLink){
        await addUser(name,'',phone,password,profileLink)
        return res.send({message : 'success'})
    }
    res.send({message : 'Invalid credentials'})
}

module.exports = {
    logIn,
    signUp
}