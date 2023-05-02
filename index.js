const express = require("express")
const {connection} = require("./db")
const {userRouter} = require("./routes/user.routes")
const {ipRouter} = require("./routes/ipadd.routes")
const logger = require("./middlewares/logger")
require("dotenv").config()

const app = express()
app.use(express.json())


app.use("/users", userRouter)
app.use("/ip", ipRouter)


app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Connected To MongoDB")
        logger.log("info", "MongoDB connected")
    } catch(err){
        console.log(err.message)
        logger.log("error", "Connection failed with DB")
    }
    console.log(`Server is running on PORT ${process.env.PORT}`)
})