const express = require('express');
const router = express.Router();
const AccountModel = require('../models/Account')
const UserModel = require('../models/User')
const zod = require('zod')
const jwt = require('jsonwebtoken');
const JWT = require('../config');
const authMiddleware = require('../middleware')

const SignUpSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    email: zod.string().email(),
    password: zod.string()
})

const updateSchema = zod.object({
    firstName : zod.string().optional(),
    lastName: zod.string().optional(),
    email: zod.string().optional(),
    password: zod.string().optional()
})

router.post('/signup',async (req,res)=>{
    const {success} = SignUpSchema.safeParse(req.body)
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body
    

    if(!success){
        return res.status(411).json({
            message:"Email already taken/ Incorrect Inputs"
        })
    }
    // validation for existingUser
    const existingUser = await UserModel.findOne({email})
    if(existingUser){
        res.send("User already exists")
        return
    }
   const dbUser = new UserModel({
        firstName,
        lastName,
        email,
        password
    })

    const userId = dbUser._id
    console.log(dbUser)
    await AccountModel.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

   
   const token = jwt.sign({userId},JWT)
   dbUser.save().then((user)=>{
    res.json({
        message:"User Created Successfully",
        token:token,
        user
       })
    
   }).catch((err)=>{
    console.log(err)
   })
  
})

const signinBody = zod.object({
    email: zod.string().email(),
	password: zod.string()
})

router.post("/login",async (req,res)=>{
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await UserModel.findOne({
        email: req.body.email
    });

    console.log(user)
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT);
  
        res.json({
            token: token,
            userId:user._id,
            name:user.firstName
        })
        return;
    }
  
    res.status(411).json({
        message: "Error while logging in"
    })

})

router.put('/',authMiddleware, async (req,res)=>{
    const success = updateSchema.safeParse(req.body)
    if(!success){
        return res.json({
            message:"Incorrect Inputs"
        })
    
    }

   await UserModel.updateOne(req.body,{
    id:req.userId
   }).then(()=>{
        res.send("User Updated")
    }).catch(()=>{
        res.send("User not updated")
    })  
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await UserModel.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})






module.exports = router;