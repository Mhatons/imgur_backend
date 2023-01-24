const mongoose = require('mongoose')
const schema = mongoose.Schema

const roleSchema = new mongoose.Schema({
    role:{
        type: String,
        required:[true, 'field is required']
    }
})


const roleModel = mongoose.model("role", roleSchema)
module.exports = roleModel