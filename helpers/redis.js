const Redis=require("ioredis")

const client=new Redis()


client.on("connect",async()=>{
    console.log(`redis status ${client.status}`)
})

module.exports={client}