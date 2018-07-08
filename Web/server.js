var methodOverride = require("method-override");
var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var middleware = require("./middleware/index");
var User = require("./models/user");
var Rent = require("./models/rent");
var Inventory = require("./models/inventory");
var indexRoutes = require("./routes/index");
var inventoryRoutes = require("./routes/inventory");
var rentRoutes = require("./routes/rent");
var userRoutes = require("./routes/user");
var compression = require('compression');
var sess;
var nodemailer = require('nodemailer');
var flash = require("connect-flash");
var creds = require("./creds");
var apiRoutes = require("./API/index");
mongoose.connect("mongodb://razor:hail3hydra@ds129321.mlab.com:29321/isap_rent");
var fileUpload = require('express-fileupload');
var path = require('path'),
    fs = require('fs');
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
app.use(fileUpload());
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
// app.use(indexRoutes);

app.use(inventoryRoutes);
app.use(userRoutes);
app.use(apiRoutes);
app.use(rentRoutes);
app.use(indexRoutes);
app.get("/", function(req, res){
    res.render("index");
}); 

app.get("/mybookings",middleware.isLoggedIn, function(req, res){
    rent.find({"phone": req.session.email, "status": "approved"}, function(err, foundRent){
        if(err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("mybookings", {allRent: allRent});         
        }
    });
});

app.get("/mypending", middleware.isLoggedIn, function(req, res){
    rent.find({"phone": req.session.email, "status": "requested"}, function(err, foundRent){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("mypending", {allRent: foundRent});
        }
    });
});



app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

//PORT listen logic!
app.listen(8888, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});
  