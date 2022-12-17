const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

//@desc register user
//@route POST /api/users
//@access Public 
const registerUser = asyncHandler(async (req, res) => {
    //check params
    const { name, email, password } = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error('please enter all fields')
    }
    //check if user exists
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user 
    const user = await User.create({
        name,
        email,
        password : hashedPassword
    })
    //see if post was successful
    if(user){
        res.status(201).json({
            _id: user.id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('invalid credentials')
    }
})

//@desc authenticate user (login)
//@route POST /api/users/login
//@access Public 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    //check if user with email exists
    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id),
        })
    }else {
        res.status(400)
        throw new Error('invalid credentials')
    }
})

//@desc get user data
//@route GET /api/users/me
//@access Private 
const getUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

//generate jwt token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = { 
    registerUser,
    loginUser,
    getUser,
 }