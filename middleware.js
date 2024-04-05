const JWT = require("./config")
const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json({
            message:"Invalid Token"
        })
    }
    const token = authHeader.split(" ")[1]
    console.log(token)
    
    try{

        const data = jwt.verify(token,JWT)
        req.userId = data.userId
        next()
    }catch{
        res.send("Invalid Token")
    }
}
module.exports = authMiddleware