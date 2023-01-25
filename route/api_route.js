const express = require('express')
const router = express.Router()
const userModel = require('../db_models/user_md')
const postModel = require('../db_models/post-md')
const likesModel = require('../db_models/likes_md')
const commentsModel = require('../db_models/comments_md')
const post_categoryModel = require('../db_models/post_category_md')
const followingModel = require('../db_models/following_md')
const PortfolioModel = require('../db_models/PortForm_md')
const roleModel = require('../db_models/roles_md')
const nodemailer = require('nodemailer')

let multer = require('multer')
// let fs = require('fs')
let path = require('path')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // fs.writeFileSync("/tmp/users.json", JSON.stringify(users))
        
        // const filePath = path.join("/tmp", "../public/uploads");
        // fs.writeFileSync(filePath, JSON.stringify(data));

        let __dir = path.join(__dirname, "../public/uploads")
        cb(null, __dir)
    }, filename: function (req, file, cb) {
        let fileName = file.originalname.toLowerCase()
        cb(null, fileName)
    }
    
})

let upload = multer({ storage })



// Create Post
router.post("/post", upload.any(), (req, res) => {

    let post = new postModel(req.body)

    req.files.map(e => {
        switch (e.fieldname) {
            case "image":
                post.image = e.filename
                break;
        }
    })

    post.save()

    res.send(post)
})

// Get all post
router.get("/posts", async (req, res) => {
    let posts = await postModel.find().lean()
    res.send(posts)
})

// get one post
router.get("/post/:id", async (req, res) => {
    let post = await postModel.findById(req.params.id)
    res.send(post)
})

// delete post
router.get("/delete_post/:id", async (req, res) => {
    await postModel.deleteOne({ _id: req.params.id })
    res.send({ "success": "post deleted successfully" })
})

// get posts by one user
router.post("/user_posts", async (req, res) => {
    let user_posts = await postModel.find({ user_id: req.body.user_id })
    res.send(user_posts)
})

// update post
router.put("/update_post", async (req, res) => { 
    // let post = await postModel.findOne({ _id: req.body.id })

    let body = JSON.parse(JSON.stringify(req.body));
    // body.body= req.body.body

    console.log(req.params)
    // console.log(post)
   
    let { id } = body;

    // let postImage = ""
    // req.files.map(e => {
    //     switch (e.fieldname) {
    //         case "image":
    //             postImage = e.filename
    //             break;
    //     }
    // })  

    // body.image = postImage

    // let user = await userModel.findById(id)
    // let data = user._doc;

    // user.overwrite({...data,...body})
    // await user.save();

    await postModel.updateOne({ _id: id }, body)
    .then(async () => {
         await postModel.findOne({ _id: id })
        res.send({ success: true, data:body })
    }).catch((err) => {
        res.send(err)
    })
    console.log(req.body);
});

// getting user by post
// router.get("/poster/:id", async (req, res) => {
//     let comm = await postModel.find({user_id: req.params.id})
//     res.send(comm)
//  })





// Create user with the map method
// router.post("/users", upload.any(), (req, res) => {

//     let user = new userModel(req.body)

//     req.files.map(e => {
//         switch (e.fieldname) {
//             case "user_image":
//                 user.user_image = e.filename
//                 break;
//         }
//     })

//     user.save()


//     res.send(user)
// })

// Create user for form with mailer verification
router.post("/create_user", upload.any(), async (req, res) => {
    console.log(req.body);

    let user = await userModel.findOne({ user_email: req.body.user_email })
    if (user !== null) {
        // res.send({ error: "user email is already taken" })
        res.send({ success: false, "message": "user email is already taken" })

    }
    else if (user == null) {
        req.body.current_verification = Math.floor(100000 + Math.random() * 900000)
        let user = new userModel(req.body)

        console.log(req.body);



        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mhatons@gmail.com',
                pass: 'tyyhgswxrtwkmwaq'
            }
        });

        let mailOptions = {
            from: 'mhatons@gmail.com',
            to: req.body.user_email,
            subject: 'Verification code',
            html: `<p> <i> Welcome </i> ${req.body.user_name} your verification code is :</p> <br> 
             <h1>${req.body.current_verification}</h1>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        req.files.map(e => {
            switch (e.fieldname) {
                case "user_image":
                    user.user_image = e.filename
                    break;
            }
        })

        user.save()
    // res.send( {success: true, "user":user})
    res.send( user )
        console.log(user);
    }


})


// get all users
router.get("/users", async (req, res) => {
    let users = await userModel.find().lean()
    let comments = await commentsModel.find().lean()
    users.forEach(userId => {
        comments.forEach(commentsId => {
            if (commentsId.user_id === userId._id) {
                commentsId.user_id = userId.user_name
            }
        })
    })
    res.send(users)
})


// get one user
router.get("/users/:id", async (req, res) => {
    let oneUser = await userModel.findById(req.params.id)
    res.send(oneUser)
})

// login user
router.post("/user_login", async (req, res) => {
    let user = await userModel.findOne({ user_email: req.body.user_email })
    if (user == null) {
        res.send({ success: false, "message": "user does not exist" })
    }
    else if (user.password !== req.body.password) {
        res.send({ success: false, "message": "incorrect user password" })
    }
    else {
        res.send({ success: true, "user": user, message: "login successful" })
    }
})

// delete user
// router.delete("/delete_user/:id", upload.any(), async (req, res) => {
//     await userModel.findByIdAndDelete({ _id: req.body.id })
//     res.send({ "success": "User deleted successfully" })
// })

router.get("/delete_user/:id", async (req, res) => {
    await userModel.deleteOne({ _id: req.params.id })
    res.send({ "success": "User deleted successfully" })
})

// update user
router.put("/update_user", upload.any(), async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    let { id } = body;


    let userImage = ""
    req.files.map(e => {
        switch (e.fieldname) {
            case "user_image":
                userImage = e.filename
                break;
        }
    })

    body.user_image = userImage

    // let user = await userModel.findById(id)
    // let data = user._doc;

    // user.overwrite({...data,...body})
    // await user.save();

    await userModel.updateOne({ _id: id }, body).then(async () => {
        let user = await userModel.findOne({ _id: id })
        let myUser = JSON.parse(JSON.stringify(user))
        res.send({ success: true, data: body })
    }).catch((err) => {
        res.send(err)
    })
})




// post & get Post_category
router.post("/post_category", async (req, res) => {
    let post_category = await post_categoryModel.create(req.body)
    res.send(post_category)
})

router.get("/post_category", async (req, res) => {
    let post_category = await post_categoryModel.find().lean()
    res.send(post_category)
})

router.get("/delete_category/:id", async (req, res) => {
    await post_categoryModel.deleteOne({ _id: req.params.id })
    res.send({ success: "category successfully deleted" })
})

router.get("/one_category/:id", async (req, res) => {
    let category = await post_categoryModel.findById(req.params.id)
    res.send(category)
})

router.put("/update_category", async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    let { id } = body
    await post_categoryModel.updateOne({ _id: id }, body)
        .then(async () => {
            let newCategory = await post_categoryModel.findOne({ _id: id })
            res.send({ success: true, data: newCategory })
        }).catch((err) => {
            res.send(err)
        })
})




// Post, Get, Delete & Update comment
router.post("/comments", async (req, res) => {
    let comment = await commentsModel.create(req.body)
    res.send(comment)
})

router.get("/comments", async (req, res) => {
    // let comments = await commentsModel.find().lean()
    let comments = await commentsModel.find().lean()
    // let comments = await commentsModel.find().lean().populate("user_id" )
    let users = await userModel.find().lean()

    let myUsers = JSON.parse(JSON.stringify(users))
    // console.log(comment[0].user_id)
    // console.log(users[3].user_name)

    // comment.forEach( commentData => {
    //     users.forEach(userData=> {
    //         if(commentData.user_id === userData._id){
    //             commentData.user_id = userData.user_name
    //         }
    //     }) 
    // })

    comments.forEach((comment) => {

        myUsers.forEach((user) => {
            if (comment.user_id === user._id) {
                comment.user_name = user.user_name
            }
            if (comment.user_id === user._id) {
                comment.user_image = user.user_image
            }
        })
    })

    res.send(comments)
})

router.get("/delete_comment/:id", async (req, res) => {
    await commentsModel.deleteOne({ _id: req.params.id })
    res.send({ "success": "comment successfully deleted" })
})

router.put("/update_comment", async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    let { id } = body
    await commentsModel.updateOne({ _id: id }, body)
        .then(async () => {
            let newComment = await commentsModel.findOne({ _id: id })
            res.send({ success: true, data: newComment })
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get("/one_comment/:id", async (req, res) => {
    let comm = await commentsModel.findById(req.params.id)
    res.send(comm)
})
router.get("/comment_post/:id", async (req, res) => {
    let comments = await commentsModel.find({ post_id: req.params.id }).lean()
    let users = await userModel.find().lean()
    let myUsers = JSON.parse(JSON.stringify(users))



    // console.log(users) 
    // console.log(comments)
    comments.forEach((comment) => {

        myUsers.forEach((user) => {
            if (comment.user_id === user._id) {
                comment.user_name = user.user_name
                comment.user_image = user.user_image
            }


        })
    })
    res.send(comments)
})





// Post, Get & Remove Likes
router.post("/likes", async (req, res) => {
    let liked = await likesModel.findOne({ user_id: req.body.user_id, post_id: req.body.post_id })

    if (liked !== null) {
        await likesModel.deleteOne({ user_id: req.body.user_id, post_id: req.body.post_id })
        res.send({ "success": "unlike successful" })
    }
    else if (liked == null) {
        let like = likesModel.create(req.body)
        console.log(req.body)
        res.send({ "success": like })
    }
    // if(user_id == null){
    //     res.send({"error": "invalid user"})
    // }
})

router.get("/likes", async (req, res) => {
    let like = await likesModel.find().lean()
    res.send(like)
})

// get likes for a post
router.get("/post_likes/:id", async (req, res) => {
    let myLikes = await likesModel.find({ post_id: req.params.id })
    res.send(myLikes)
})





// post and get Follow
router.post("/follow", async (req, res) => {
    let unfollow = await followingModel.findOne({ user_id: req.body.user_id, follower_id: req.body.follower_id })
    if (unfollow !== null) {
        await followingModel.deleteOne({ user_id: req.body.user_id, follower_id: req.body.follower_id })
        res.send({ success: false, message: "user unfollowed" })
    }
    else if (unfollow == null) {
        let follow = await followingModel.create(req.body)
        res.send({ success: true, "follow": follow, message: "follow successful" })
    }

})

router.get("/follow", async (req, res) => {
    let follow = await followingModel.find().lean()
    res.send(follow)
})

router.get("/follow_user/:id", async (req, res) => {
    let followers = await followingModel.find({ user_id: req.params.id })
    res.send(followers)
})




// post roles 
router.post("/roles", async (req, res) => {
    let roles = await roleModel.create(req.body)
    res.send(roles)
})

// Get all roles
router.get("/roles", async (req, res) => {
    let roles = await roleModel.find().lean()
    res.send(roles)
})

router.put("/update_roles", async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    let { id } = body
    await roleModel.updateOne({ _id: id }, body)
        .then(async () => {
            let newRole = await roleModel.findOne({ _id: id })
            res.send({ success: true, data: newRole })
        })
        .catch((err) => {
            res.send(err)
        })
})


// get one role
router.get("/role/:id", async (req, res) => {
    role = await roleModel.findById(req.params.id)
    res.send(role)
})

// Delete role
router.get("/delete_roles/:id", async (req, res) => {
    await roleModel.deleteOne({ _id: req.params.id })
    res.send({ success: "role deleted successfully" })
})




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
    console.log(req.body)
})

router.get('/get_form', async (req, res) => {
    let getUsers = await PortfolioModel.find().lean()
    res.send(getUsers)
})

module.exports = router