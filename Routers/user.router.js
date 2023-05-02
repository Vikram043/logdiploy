const express=require("express")
const userRoute=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { User } = require("../module/user.model")
const { client } = require("../helpers/redis")


userRoute.post('/signIn',async(req,res)=>{
    try {
       const {name,email,password,Ip} =req.body
       const user_exists=await User.findOne({email})

       if(user_exists) return res.status(400).send({msg:"User Exists Please login"})

       const hash=await bcrypt.hash(password,8)

       if(!hash) return res.status(400).send({msg:"Password formate is wrong"})

       const user=new User({...req.body,password:hash})
       await user.save()

       res.status(200).send({msg:"SignIn Succesfull"})
    } catch (error) {
        res.status(400).send({msg:error.message}) 
    }
})


userRoute.post('/login',async(req,res)=>{
    try {
       const {email,password} =req.body
       const user_exists=await User.findOne({email})

       if(!user_exists) return res.status(400).send({msg:"User not found Please signIn"})

       const decode=await bcrypt.compare(password,user_exists.password)

       if(!decode) return res.status(400).send({msg:"Wrong credintials"})

        const AccessToken=jwt.sign({userId:user_exists.id,email},process.env.secret,{expiresIn:"1h"})
        const RefreshToken=jwt.sign({userId:user_exists.id,email},process.env.secret,{expiresIn:"7h"})

       client.set("AccessToken",AccessToken)
       client.set("RefreshToken",RefreshToken)

       res.status(200).send({msg:"Login Succesfull"})

    } catch (error) {
        res.status(400).send({msg:error.message}) 
    }
})

userRoute.get('/logout',async(req,res)=>{
    try {
        const RefreshToken=await client.get("RefreshToken")
        const AccessToken=await client.get("AccessToken")
        if(!RefreshToken)  return res.status(400).send({msg:"Unauthorized"})

        const decode=jwt.verify(RefreshToken,process.env.secret)
        if(!decode) return res.status(400).send({msg:"Already logged out"})

       client.mset(RefreshToken,RefreshToken ,AccessToken,AccessToken)
    
       res.status(200).send({msg:"Logout Succesfull"})

    } catch (error) {
        res.status(400).send({msg:error.message}) 
    }
})




module.exports={userRoute}