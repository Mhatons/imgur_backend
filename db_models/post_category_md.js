const mongoose = require('mongoose')
const schema = mongoose.Schema

const post_categorySchema = new mongoose.Schema({
    post_category_name:{
        type: String,
        required:[true, 'field is required']
    }
})


const post_categoryModel = mongoose.model("post_category", post_categorySchema)
module.exports = post_categoryModel