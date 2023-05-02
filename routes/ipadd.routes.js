const express = require("express")
const axios = require("axios")
const {client} = require("../redis")
const ipRouter = express.Router()

ipRouter.get("/info", async (req, res)=>{
    const ip = req.query.ip
    const cacheData = await client.get(ip)
    if(cacheData){
        console.log("Cache Data From Redis")
        return res.status(200).send(cacheData)
    } else{
        const respos = await axios.get(`https://ipapi.co/${ip}/json/`)
        const data = respos.data
        client.set(ip, JSON.stringify(data), "EX", 60)
        res.status(200).send(data)
    }
})

module.exports = {ipRouter}