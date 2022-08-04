const User=require("../models/users.model");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const newToken=(user)=>{
    return jwt.sign({ user}, "ANOX");
}

const register=async(req,res)=>{
    try{
        let user=await User.findOne({email:req.body.email}).lean().exec();
        
        if(user){
            return res.send("user already exists")
        }
        user=await User.create(req.body);
        const token=newToken(user)

        return res.status(200).send('registration successfull')
    }
    catch(err){
        return res.status(500).send(err.message)
    }
}


const login=async(req, res)=>{
    try{
        let user=await User.findOne({email:req.body.email});

        if(!user){
            return res.send("user not found")
        }

        const match=user.check(req.body.password);
        if(!match){ return res.send("incorrect password entered")}
        const token=newToken(user)

        return res.status(200).json({email:user.email, token })
    }
    catch(err){
        return res.status(500).send(err.message)
    }
}
const forgot=async(req, res)=>{
    try{
        let user=await User.findOne({email:req.body.email});
        if(!user){
            return res.send("user not found")
        }
        if(req.body.email&&req.body.password&&req.body.otp){
            var hash = bcrypt.hashSync(req.body.password, 8);
             await User.findByIdAndUpdate(user._id, {password:hash}, {new:true});
            return res.status(200).json("password reset successfully");
        }
        else if(req.body.email){
            const otp = Math.floor(Math.random()*10000)
            return res.status(200).json(otp)
        }

    }
    catch(err){
        return res.status(500).send(err.message)
    }
}

module.exports ={register,login, forgot}
