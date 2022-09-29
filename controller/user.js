const bcrypt = require('bcrypt');
const op = require('sequelize');
const User = require('../model/signup');

const jwt = require('jsonwebtoken');
const { response } = require('express');
const token = '2e67c65743d09e2b193cfbe1c3f2e2d34ffa2df6a7385af4a8d33ff991b4d70d661d5f0578315212a1c261cd7d6707427a167172512bdaffb71252ae4c8b28cc'

function generateAccessToken(id){
    return jwt.sign(id, token)
}

exports.signup = ((req, res) => {
try{
   const {name, email, contact, password} = req.body;
   bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt,function(err, hash){
        if(err){
            console.log('Unable to create new User');
            res.json({message:"Unable to create new User"});
        }
        User.create({name, email,contact, password:hash})
        .then(() => {
            res.status(201).json({message:"SuccessFully created user"});
        })
        .catch(err => {
            console.log(err);
            res.status(403).json(err);
        })
    })
   })
  
   
}
catch{
    err => {
        res.status(403).json(err);
    }
}
});

exports.login = ((req, res) => {
    try{
        const {email, password} = req.body;
        User.findAll({where:{email:email}}).then(result => {
            if(result[0] != undefined){
                bcrypt.compare(password, result[0].password, (err, response) => {
                    if(err){
                        console.log(err);
                        return res.json({success: false, message: 'Something went wrong'});
                    }
                    if(response){
                        console.log("Inside response", result[0].id);
                        console.log(response);
                        const jwtToken = generateAccessToken(result[0].id);
                        return res.json({token: jwtToken, success: true, message: "Successfully logged In"});
                    }else{
                        //Not found
                        return res.status(401).json({success: false, message: 'PAssword does not match'});
                    }
                })
            }
            else{
                return res.status(401).json({success: false, message:"User not found"});
            }
        })
    }
    catch {
        err => {
            console.log(err);
        }
    }
});



exports.getAllUsers = ((req, res) => {
    const name = req.query.name;
    const email = req.query.email;
    const user = (name && email) ? User.findAll({where:{name : name, email : email}}) : User.findAll();    
    user.then(user =>{
        return res.status(200).json({message: "Successfully retrieve all the users",user})
    })
    .catch(err => {
        console.log(err);
    })
});


