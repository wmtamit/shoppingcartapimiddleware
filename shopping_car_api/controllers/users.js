const User = require('../models/user')
const mongoose= require('mongoose');
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

exports.users_signup_user=(req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        // console.log(user)
        if (user.length > 0) {
          return res.status(409).json({
            message: "email already exist"
          });
        } else {
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            if (err) {
              res.status(500).json({ error: err });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(user => {
                  console.log(user);
                  res.status(201).json({
                    message: "User Created",
                    createdUser: {
                      email: user.email
                    }
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
  }

exports.users_login_user=(req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user=>{
          if(user.length<1){
              return res.status(401).json({
                  message:"User not registerd "
              })
          }
          bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
              if(err){
                  return res.status(401).json({
                      message:"Authentication Failed"
                  });
              }
              if(result){
              const token=jwt.sign({
                      email:user[0].email,
                      userId:user[0]._id
                  },"privatekey",{expiresIn:"1h"},)
                  return res.status(200).json({
                      message:"Authentication Successfuly",
                      token:token
                  });
              }
              return res.status(401).json({
                  message:"Authentication Failed",
                 
              });
          })
  
      })
      .catch(err=>{
          res.status(500).json({
              error:err
          })
      });
  }


  exports.users_delete_user=(req, res, next) => {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(user => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }