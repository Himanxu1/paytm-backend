require("dotenv").config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const router = require('./routes/index')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use("/api/v1",router)


mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true})
.then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err)
})



app.listen(3001, () => {
    console.log('Server is running on port 3001')
})
