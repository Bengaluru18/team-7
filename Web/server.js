var methodOverride = require("method-override");
var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var User = require("./models/user");
var Rent = require("./models/rent");
var Inventory = require("./models/inventory");
var indexRoutes = require("./routes/index");
var compression = require('compression');
var sess;
var nodemailer = require('nodemailer');
var flash = require("connect-flash");



mongoose.connect("mongodb://127.0.0.1:27017/test_lms");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(flash());

app.use(compression());
app.use(require('cookie-parser')());

app.use(require("express-session")({
    secret: 'Bingo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }

}));

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    if (!req.session.email) {
        res.locals.user = "none";
    next();
    }
    else {
        res.locals.user = req.session.email;
        res.locals.course = req.session.course;
        next();
    }
 });

function isLoggedIn(req, res, next) {
    if (req.session.email) {
        return next();
     } else {
        res.redirect("/login");
     }
}
