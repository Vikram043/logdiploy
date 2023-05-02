const express=require("express")
const { connect } = require("./controllers/db")
const { userRoute } = require("./Routers/user.router")
const { authenticator } = require("./middleware/auth")
const { logger } = require("./middleware/logger")
const { IpRoute } = require("./Routers/ip.router")

const app=express()

app.use(express.json())

app.get('/',(req,res=>{
    res.status(200).send({message:"Welcome to home page"})
}))

app.use("/",userRoute)

app.use('/',IpRoute)


app.listen(process.env.port,async()=>{
    try {
        await connect
        console.log("Connected to Db")
        logger.log("info","Connected to Db")
    } catch (error) {
        console.log(error.message)
        logger.log("error","Connection failed")
    }
})