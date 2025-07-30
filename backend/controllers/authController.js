const User =require('../models/User')
const jwt=require('jsonwebtoken');

//generate jwt token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"});
};

//register user
exports.registerUser=async(req,res)=>{
    const{fullName,email,password,profileImageUrl}=req.body;

    //Validation: Check for mising fields
    if(!fullName || !email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }

    try{
        //check if email already exists
        const existingUser=await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({message:"Email already in use"});
        }

        const user=await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        });
    }catch(err){
        res
            .status(500)
            .json({message:"error registering user",error:err.message});
    }
};

//login user
exports.loginUser=async(req,res)=>{
    const {email,password}=req.body;
    //Validation: Check for missing fields
    if(!email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }
    try{
        //check if user exists
        const user=await User.findOne({ email });
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        //check password
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        res.status(200).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        });
    }catch(err){
        res
            .status(500)
            .json({message:"error logging in user",error:err.message});
    }
}

//Register user
exports.getUserInfo=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message:"error getting user info",error:err.message});
    }
}







