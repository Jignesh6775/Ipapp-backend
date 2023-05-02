const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
}, {
    timestamps: true
})


const UserModel = mongoose.model("user", userSchema)

module.exports = { UserModel }