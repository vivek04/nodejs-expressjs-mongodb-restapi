const express = require('express');
const User = require('../models/User');
const usercontroller = require('../controllers/user');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { route } = require('express/lib/application');
const auth = require('../middleware/auth');

//ALL Usr
router.get('/', auth, usercontroller.getAllUser);
router.post('/add', usercontroller.addUser);
//add Usr

//Get  Usr by id
router.get('/:postid' , async(req, res) => {
    
    try{
        const user = await User.findById(req.params.postid);
        res.json(user);
    }catch(err){
        res.json({message:err});
    }
      
});
//Delete  Usr by id
router.delete('/:postid' , async(req, res) => {
    
    try{
        const user = await User.remove(req.params.postid);
        res.json(user);
    }catch(err){
        res.json({message:err});
    }
      
});
//update  Usr by id
router.patch('/:postid' , async(req, res) => {
    
    try{
        const user = await User.updateOne(
            {_id: req.params.postid},
            {$set: {username :req.body.username}}
            );
        res.json(user);
    }catch(err){
        res.json({message:err});
    }
      
});

//Signing router
router.post('/signin', async(req, res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please Add Email or Password"})
    }
    User.findOne({email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(domatch => {
            if(domatch){
                const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
                const {_id,username,email,role} = savedUser
                res.json({token,user:{_id,email,username}})
            }else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        }).catch(err=>{
            console.log(err);
        })
    }).
    catch(err=>{
        console.log(err);
    })
});
module.exports = router;