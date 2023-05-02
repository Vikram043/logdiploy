const express=require("express")
const IpRoute=express.Router()
const { client } = require("../helpers/redis")
const axios = require("axios")
const { Ip } = require("../module/ip.model")
const { authenticator } = require("../middleware/auth")
const { ipcheck } = require("../middleware/chekIp")

IpRoute.get("/ip",authenticator,ipcheck, async(req,res)=>{
    try {
        const ip="8.8.8.8"
        let city;

        const data=await client.get(`${ip}`)
        if(data) return res.status(200).send({message:data})

        const mongodata=await Ip.findOne({ip})
        if(mongodata) return res.status(200).send({message:mongodata})

        const ipdata=await axios.get(`https://ipapi.co/8.8.8.8/city/`)
        
        client.set(ip,JSON.stringify(ipdata.data))

        const savedata=new Ip({Ip:ip})
        await savedata.save()

        res.status(200).send({message:JSON.stringify(ipdata.data)})

    } catch (error) {
        res.status(400).send({message:error.message})
    }
})



module.exports={IpRoute}


