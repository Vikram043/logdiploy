const mongoose=require("mongoose")

const ipSchema=mongoose.Schema({
    userId:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    Ip:{typr:String}
})

const Ip=mongoose.model("ip",ipSchema)

module.exports={Ip}