const Redis = require("ioredis")
require("dotenv").config()

let configuration = {
    port: 17975, // Redis port
    host: "redis-17975.c305.ap-south-1-1.ec2.cloud.redislabs.com", // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.Redis_pass
  }

const client = new Redis(configuration)

module.exports = {client}

//redis-17975.c305.ap-south-1-1.ec2.cloud.redislabs.com:17975