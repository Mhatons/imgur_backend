const mongoose = require('mongoose')
const schema = mongoose.Schema

const likesSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required:[true, 'field is required']
    },
    post_id:{
        type: String,
        required:[true, 'field is required']
    }
})


const likesModel = mongoose.model("likes", likesSchema)
module.exports = likesModel