
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//const md5 = require('md5');
const app = express();
const bcrypt = require ('bcrypt');
const saltRounds = 10;
app.set('view engine', 'ejs');

//console.log(process.env.API_KEY);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});
const User = mongoose.model("User", userSchema);
app.get("/", function(rq, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
       email: req.body.username,
       password: hash
     });

     newUser.save(function(err){
       if (!err){
         res.render("secrets");
       } else {
         res.send(err);
       }
     });
});

 });

 app.post("/login", function(req, res) {
const userName = req.body.username;
//const password = md5(req.body.password);
const password = req.body.password;

     User.findOne({email: userName}, function(err, foundUser){
       if (err) {
         console.log(err);
       } else {
         if(foundUser) {
           bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
         }
       }
     });
   });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
