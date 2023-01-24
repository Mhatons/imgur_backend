const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const apiRoute = require("./route/api_route")
const portfolioRoute = require("./route/portfolio_route")
const path = require('path')
const cors = require('cors')

// solve cors issue
app.use(cors({origin: '*'}))

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
mongoose.set("strictQuery", true)

app.use("/", apiRoute)

// mongoose.connect("mongodb://localhost/imgur_db", {useNewUrlParser:true, useUnifiedTopology: true },
// err => {
//     if(err)throw err 
//     console.log("Database Connected")
// })


mongoose.connect("mongodb+srv://admin:imguradmin@cluster0.wzvc4wk.mongodb.net/imgur_db?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology: true },
err => {
    if(err)throw err 
    console.log("Cloud Database Connected")
})




mongoose.Promise = global.Promise

// const PORT = 4001
app.listen(4001, () => {
    console.log("Running on http://localhost:4001")
})
