const route = require("express").Router();

route.get("/overall", async(req,res,next)=>{
    res.json({
        success: true,
        statusCode: 200
    })
})

module.exports = route;