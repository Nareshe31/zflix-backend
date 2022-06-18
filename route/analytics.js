const express = require("express");
const router = express.Router();
const service = require("../service/analytics.js");

router.post('/add-page-request',async(req,res,next)=>{
    try {
        let {body}=req
        let response=await service.addPageRequest(body)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

module.exports = router;
