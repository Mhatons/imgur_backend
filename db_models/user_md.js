const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    user_name:{
        type: String,
        required:[true, 'field is required']
    },
    user_email:{
        type: String,
        required:[true, 'field is required']
    },
    user_phone:{
        type: String,
        required:[true, 'field is required']
    },
    user_image:{
        type: String,
        required:[true, 'field is required']
    },
    verified_at:{
        type: String,
    },
    current_verification:{
        type: String,
    },
    expiration_date:{
        type: String,
    },
    role_id:{
        type: String,
        required:[true, 'field is required']
    },
    password:{
        type: String,
        required:[true, 'field is required']
    },
    confirm_password: {
        type: String,
        required:[true, 'field is required']
    }
})


const userModel = mongoose.model("user", userSchema)
module.exports = userModel