var methodOverride = require("method-override");
var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
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
mongoose.connect("mongodb://razor:hailhydra3@ds129321.mlab.com:29321/isap_rent");

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
app.use(indexRoutes);
app.use(middleware);
app.use(inventoryRoutes);
app.use(userRoutes);
app.use(rentRoutes);
app.use(creds);


app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

//PORT listen logic!
app.listen(8888, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});
  