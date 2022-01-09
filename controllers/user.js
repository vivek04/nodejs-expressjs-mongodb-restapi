const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUser = async (req, res, next) => {
//router.get('/', auth ,async(req,res) => {
    try {
        const alluser = await User.find();
        res.json(alluser);
    } catch (error) {
        res.json({message:error});
    }
     
};

const addUser = async(req, res, next) => {
    const {email,username,password} = req.body
    if(!email || !password || !username){
        return res.status(422).json({error:"Please add all fields"});
    }
    User.findOne({email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exsist"});
        }
    
     
    bcrypt.hash(password,10)
    .then(hashedpassword => {
        const user = new User({
                username,
                email,
                password:hashedpassword
        })
        user.save()
        .then(user=>{
            res.json({message:"Saved Succcessfully"})
        }).catch(err=>{
            console.log(err);
        })
    })
     
    })
     
};

module.exports = {
    getAllUser,
    addUser
}