const route = require("express").Router();
const Order = require("../db/Models/Order");
route.get("/overall", async(req,res,next)=>{
    res.json({
        success: true,
        statusCode: 200
    })
})

route.post("/order", async(req,res,next)=>{
    try{
        let body = {...req.body};
        let order = new Order(body);
        order = await order.save();
        return res.json({
            success: true,
            statusCode: 200,
            body: {
                ...body
            }
        })
    }catch(err){
        return res.json({
            success: false,
            statusCode: 500,
            body: err.stack
        })
    }
})

module.exports = route;