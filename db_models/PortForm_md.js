const mongoose = require('mongoose')
const schema = mongoose.Schema

const PortfolioSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'field is required']
    },
    email:{
        type: String,
        required:[true, 'field is required']
    },
    phone:{
        type: String,
        required:[true, 'field is required']
    },
    subject:{
        type: String,
        required:[true, 'field is required']
    },
    comment:{
        type: String,
        required:[true, 'field is required']
    }
})


const PortfolioModel = mongoose.model("portfolio", PortfolioSchema)
module.exports = PortfolioModel