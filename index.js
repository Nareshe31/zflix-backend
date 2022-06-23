const express=require('express')
const app=express()

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const axios=require('axios')
const fs=require('fs')
const PORT=process.env.PORT || 5000
const torrentRouter=require('./route/torrent.js')
const authRouter=require('./route/auth.js')
const analyticsRouter=require('./route/analytics.js')
const authRouteV3=require('./route/v3/auth')
const userRouteV3=require('./route/v3/user')

const path = require('path');
const bodyParser=require('body-parser')
const authorization=require('./middleware/authorization.js')

const cors = require('cors');
const corsOptions ={
    origin:'https://zflix-app.netlify.app', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json())

//v2 Routes
app.use('/api/v2/',torrentRouter)
app.use('/api/v2/',authRouter)
app.use('/api/v2/',analyticsRouter)

//v3 Routes
app.use('/api/v3/',authRouteV3)
app.use('/api/v3/',authorization,userRouteV3)


app.get('/watch/tv/:tvId/:season/:episode',(req,res)=>{
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body style="margin:0;height: 100vh;
    width: 100vw;
    position: relative;">
      <iframe id="watch" scrolling="no" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" src="https://www.2embed.ru/embed/tmdb/tv?id=${req.params.tvId}&s=${req.params.season}&e=${req.params.episode}" style="border: 0px; width: 100%; height: 100%; display: block; margin: 0px; padding: 0px;"></iframe>
  </body>
  </html>`)
})

app.get('/watch/movie/:movieId',(req,res)=>{
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body style="margin:0;height: 100vh;
    width: 100vw;
    position: relative;">
        <iframe id="watch" scrolling="no" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" src="https://www.2embed.ru/embed/imdb/movie?id=${req.params.movieId}" style="border: 0px; width: 100%; height: 100%; display: block; margin: 0px; padding: 0px;"></iframe></div></div>
  </body>
  </html>`)
})

app.get('/*/',(req,res,next)=>{
  try{
    res.redirect('https://zflix-app.netlify.app/')
  }
  catch(error){
    next(error)
  }
})

app.use((error,req,res,next)=>{
  if(error.status){
    res.status(error.status)
  }
  else{
    res.status(400)
  }
    res.json({response:false,message:error.message})
})

// if (process.env.NODE_ENV === "production") {

//     // Set static folder   
//     // All the javascript and css files will be read and served from this folder
//     app.use(express.static("client/build"));
  
//     // index.html for all page routes    html or routing and naviagtion
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//     });
//   }

app.listen(PORT,()=>{
    console.log(`Server is running in ${PORT} port`);
})