const mongoose = require('mongoose')
const schema = mongoose.Schema

const postSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required:[true, 'field is required']
    },
    post_category_id:{
        type: String,
        required:[true, 'field is required']
    },
    date:{
        type: Date,
        required:[true, 'field is required']
    },
    title:{
        type: String,
        required:[true, 'field is required']
    },
    excerpt:{
        type: String,
        required:[true, 'field is required']
    },
    image:{
        type: String,
        required:[true, 'field is required']
    },
    body:{
        type: String,
        required:[true, 'field is required']
    }
})


const postModel = mongoose.model("post", postSchema)
module.exports = postModel