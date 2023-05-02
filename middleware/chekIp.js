
const ipcheck=(req,res,next)=>{
    const {ip}=req.params

    next()
}

module.exports={ipcheck}