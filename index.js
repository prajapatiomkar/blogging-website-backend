const express = require("express")
require("dotenv").config()
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/User.js")
const bcrypt = require("bcryptjs")
const app = express()
const jwt = require("jsonwebtoken")
var cookieParser = require('cookie-parser')



const salt = bcrypt.genSaltSync(10)
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(express.json())
app.use(cookieParser())
mongoose.set('strictQuery', true)
mongoose.connect(process.env.URL)
    .then(() => {
        console.log("Connected to database")
    })

app.post("/register", async (req, res) => {
    const { username, password } = req.body
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        })
        res.json(userDoc)
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    const userDoc = await User.findOne({ username })
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
        //logged in
        jwt.sign({ username, id: userDoc._id }, process.env.SECRET_KEY, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username, 
            })

        })
        // res.json()
    } else {
        res.status(400).json("Bad Credential")
    }
    // res.json({ res: userDoc, check: passOk })

})

app.get("/profile", (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, process.env.SECRET_KEY, {}, (err, info) => {
       if(err) throw err
       res.json(info)
    })
    
})

app.post("/logout",(req,res)=>{
    res.cookie('token','').json('ok')
})
app.listen(4000)