const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
    Ip:{typr:String}
})

const User=mongoose.model("user",userSchema)

module.exports={User}