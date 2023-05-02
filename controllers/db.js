const mongoose=require("mongoose")
require("dotenv").config()

const connect=mongoose.connect(process.env.mongo_url)


module.exports={connect}

