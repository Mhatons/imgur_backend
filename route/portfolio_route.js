const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')


const PortfolioModel = require('../db_models/PortForm_md')

router.post("/post_form", async (req, res) => {
    let post = await PortfolioModel.create(req.body)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mhatons@gmail.com',
            pass: 'tyyhgswxrtwkmwaq'
        }
    });

    let mailOptions = {
        from: req.body.email,
        to: 'mhatons@gmail.com',
        subject: 'Portfolio Review',
        html: `
            <p> <i> Name </i> ${req.body.name}</p> <br> 
            <p> <i> Email </i> ${req.body.email}</p> <br> 
            <p> <i> Phone Number </i> ${req.body.phone}</p> <br> 
            <p> <i> Subject </i> ${req.body.subject}</p> <br> 
            <p> <i> comment </i> ${req.body.comment}</p> <br> 
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    res.send(post)
})

router.get('/portfolio', async (req, res) => {
    let getUsers = await PortfolioModel.find().lean()
    res.send(getUsers)
})