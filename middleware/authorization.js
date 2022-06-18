const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "sadif23r2n";

router.use(async function (req, res, next) {
  // let error=new Error("Not authorized")
  // error.status=401
  // throw error
  try{
    let token=req.headers?.authorization?.split(' ')[1]
    const payload = await jwt.verify(token, JWT_SECRET);
    req.body.user=payload
    next()
  }
  catch(error){
    let err=new Error("Not authorized. Please login to continue")
    err.status=401
    next(err)
    // res.status(401).json({response:false,message:"Not authorized"})
  }
  
})

module.exports=router

