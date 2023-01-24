const mongoose = require('mongoose')
const schema = mongoose.Schema

const commentsSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required:[true, 'field is required'],
        ref:"user"
    },
    post_id:{
        type: String,
        required:[true, 'field is required']
    },
    text:{
        type: String,
        required:[true, 'field is required']
    }
})


const commentsModel = mongoose.model("comments", commentsSchema)
module.exports = commentsModel