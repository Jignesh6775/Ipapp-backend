const jwt = require("jsonwebtoken")
require("dotenv").config()
const {client} = require("../redis")


const auth = async(req, res, next)=>{
    try {
        const accesstoken = req.headers.authorization

        if(!accesstoken) return res.status(400).send({ "msg" : "Please Login First .." })

        jwt.verify(
            accesstoken,
            process.env.JWT_SECRET,
            (err, payload) =>{
                if(err){
                    res.status(401).send({ "msg" : err.message })
                } else {
                    req.userId = payload.userId
                    const isTokenBlacklisted = client.get(payload.userId+"Blacklisted")

                    if(isTokenBlacklisted){
                        res.status(400).send({ "msg" : "Please Login Again .." })
                    } else {
                        next()
                    }
                }
            }
        )
    } catch (err) {
        res.status(400).send({ message: "Unauthorised", "msg" : err.message })
    }
}

module.exports = {auth}
