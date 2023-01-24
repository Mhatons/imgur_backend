const mongoose = require('mongoose')
const schema = mongoose.Schema

const followingSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required:[true, 'field is required']
    },
    follower_id:{
        type: String,
        required:[true, 'field is required']
    }
})


const followingModel = mongoose.model("following", followingSchema)
module.exports = followingModel