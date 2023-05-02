const express = require("express")
const userRouter = express.Router()
const {UserModel} = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const {client} = require("../redis")
const {auth} = require("../middlewares/auth.middleware")

const app = express()


userRouter.post("register", async(req, res)=>{
    const {email, pass} = req.body
    try{
        //check user
        const userExists = await UserModel.findOne({ email })
        if(userExists){
            return res.status(400).json({ message : "User already exists" })
        }

        //create new user
        bcrypt.hash(pass, 5, async (err, hash) =>{
            const user = new UserModel({ email, pass: hash })
            await user.save()
            res.status(200).send({ "msg" : "User register successfully"})
        })
    }  catch (err) {
        res.status(400).send({ "msg" : err.message, "err": "error123" })
    }
})


userRouter.post("login", async(req, res)=>{
    const {email, pass} = req.body
    try {
        //Check User
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).send({ "msg" : "Invalid Username" })
        }

        //Check Password
        const passwordMatch = await bcrypt.compare( pass, user.pass )
        if(!passwordMatch){
            return res.status(400).send({ "msg" : "Invalid Password" })
        }

        //Create access token
        const accesstoken = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1hr"
        })

        const userId = req.userId
        client.set(userId+"AccessToken", accesstoken)

        res.status(200).send({ "msg" : "Login Successfull" })

    } catch (err) {
        res.status(400).send({ "msg" : err.message })
    }
})


userRouter.get("/logout",auth, async(req,res)=>{
    try {
        const token = req?.headers?.authorization

        const userId = req.userId
        client.set(userId+"Blacklisted", token)
        res.status(200).send({ "msg" : "Logout Successfull" })
    } catch (err) {
        res.status(400).send({ "msg" : err.message })
    }
})


module.exports = { userRouter }