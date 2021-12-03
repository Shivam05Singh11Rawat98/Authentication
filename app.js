//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/UserDB',{useNewUrlParser : true});

const userSchema = new mongoose.Schema({
  email: String,
  password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model('User', userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.route("/login").get((req,res)=>{
  res.render("login");
})
.post((req,res)=>{
  var userName=req.body.username;
  var password=req.body.password;

  User.findOne({ email:userName},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser.password === password){
        res.render("secrets");
      }
      else{
        console.log("Wrong Credentials");
      }
    }
  })
});

app.route("/register").get((req,res)=>{
  res.render("register");
})

.post((req,res)=>{
  const user1 = new User({
    email: req.body.username,
    password: req.body.password
  });
  user1.save();
  res.render("secrets");
});

app.listen(3000,()=>{
  console.log("Working Fine");
})
