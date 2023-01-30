const mongoose = require("mongoose")

const UserScheme = mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 4
    },
    password: {
        type: String,
        require: true
    }
})

const UserModel = mongoose.model("User",UserScheme)
module.exports = UserModel