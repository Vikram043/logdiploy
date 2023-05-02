const jwt=require("jsonwebtoken")
const { client } = require("../helpers/redis")

const authenticator=async(req,res,next)=>{
    try {
        const RefreshToken=await client.get("RefreshToken")
        if(!RefreshToken) return res.status(400).send({message:"Please login for access"})

        const decode=jwt.verify(RefreshToken,process.env.secret)
        if(!decode) return res.status(400).send({msg:"Please login again"})

        const blacklist=await client.get(RefreshToken)
        if(blacklist) return res.status(400).send({msg:"Unauhorized please login again"})

        const userId=decode.userId
        const ip=decode.Ip

        next()

    } catch (error) {
        res.status(400).send({msg:error.message}) 
    }
}

module.exports={authenticator}