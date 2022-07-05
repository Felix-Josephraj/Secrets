//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { name } = require("ejs");
const encrypt = require('mongoose-encryption');
const app = express();
var md5 = require('md5');

// connecting to mongoose
mongoose.connect('mongodb+srv://felixanderson500:Life%401998@atlascluster.2rtpa.mongodb.net/wikiDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env.SECRET);

// Using encryption
// var secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');         //To view the files present in views folder

app.use(express.static("public"));    // To make "public" folder as public

app.get("/", function (req, res) {
    res.render("home");
});

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const username = req.body.username;
        const password = md5(req.body.password);

        User.findOne({ email: username }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    console.log("wrong password");
                }
            }
        });
    });

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: md5(req.body.password)
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });



const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server started on port 3000");
});

