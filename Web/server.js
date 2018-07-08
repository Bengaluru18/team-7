var methodOverride = require("method-override");
var express =  require("express");
var nodemailer = require('nodemailer');
var msg91 = require("msg91")("222454ArMCDd9QRY2V5b30fef6", "WatUWant", "1" );
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'hello@jaysinha.me',
        pass: 'imRAZOR20$'
}
});
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var middleware = require("./middleware/index");
var User = require("./models/user");
var rent = require("./models/rent");
var inventory = require("./models/inventory");
var indexRoutes = require("./routes/index");
var inventoryRoutes = require("./routes/inventory");
var rentRoutes = require("./routes/rent");
var userRoutes = require("./routes/user");
var compression = require('compression');
var sess;
var json2xls = require('json2xls');
// var nodemailer = require('nodemailer');
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
app.use(json2xls.middleware);

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
        res.locals.role = req.session.role;
        next();
    }
});
// app.use(indexRoutes);
app.use(rentRoutes);
app.use(inventoryRoutes);
app.use(userRoutes);
app.use(apiRoutes);
app.use(indexRoutes);
app.get("/", function(req, res){
    res.render("index");
}); 

app.get("/mybookings",middleware.isLoggedIn, function(req, res){
    rent.find({"phone": req.session.email, "status": "confirmed"}, function(err, foundRent){
        if(err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("mybookings", {allRent: foundRent});         
        }
    });
});

app.get("/mypending", middleware.isLoggedIn, function(req, res){
    rent.find({"phone": req.session.email, "status": "pending"}, function(err, foundRent){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("mypending", {allRent: foundRent});
        }
    });
});

app.get("/booking", middleware.isLoggedIn, function(req, res){
    res.render("book");
});

app.get("/book/:hrs/:iid/:mode", middleware.isLoggedIn, function(req, res){
    inventory.findById(req.params.iid, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
        if (req.params.mode == "online") {
            var pending_payment = false;
        } else {
            var pending_payment = true;
        }
        if (foundInventory['quantity'] > 0) {
        rent.create({
            name: req.session.name,
            price: foundInventory['pph'] * req.params.hrs,
            phone: req.session.email,
            mname: foundInventory['name'],
            mtype: foundInventory['type'],
            days: parseInt(req.params.hrs)/24,
            status: "pending",
            pending_payment: pending_payment,
            mode: req.params.mode
        }, function(err, newRent){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            // inventory.findByIdAndUpdate(foundInventory['_id'], {"quantity": foundInventory['quantity']-1});
            var mailOptions = {
                from: newRent['name']+'<hello@jaysinha.me>', 
                to: 'razor.sinha.08@gmail.com', 
                subject: 'Booking Requested: ' + newRent['_id'], 
                html: 'Name: <b>' + newRent['name']+"</b><br>Approve Link: " + "/api/rent/"+newRent['_id'] +"/approve"     // html body
            };


            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
            var message = 'Service Requested: ' + newRent['mname'] + '. Our executive will get in touch with you shortly. Team ISAP!';
                    msg91.send('918660840789', message, function(err, response){
                        // console.log(err);
                        console.log(response);
                });
            res.redirect("/mypending");
        }
    });
}
else {
    res.send({"success": false, "quantity": 0});
} 
}
});
});

app.post("/dateSelect", middleware.isLoggedIn, function(req, res){
    var date1 = req.body.startDate;
    console.log(date1);
    var month = parseInt(date1.slice(5,7)); //months from 1-12
    var day = parseInt(date1.slice(8,10));
    var year = parseInt(date1.slice(0,4));
    var nd1 = new Date(year, day, month);


    var date2 = req.body.endDate;
    var month1 = parseInt(date2.slice(5,7)); //months from 1-12
    var day1 = parseInt(date2.slice(8,10));
    var year1 = parseInt(date2.slice(0,4));
    var nd2 = new Date(year1, day1, month1);

    var timeDiff = Math.abs(nd2 - nd1);
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    var hours = diffDays*24;
    inventory.find({}, function(err, allInventory){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            var inv = [];
            allInventory.forEach(function(x){
                
                if (x['quantity'] > 1) {
                    inv.push(x);
                } 
            });
            res.render("listing", {allInventory: inv, hours: hours});
        }
    });
});

app.get("/report", middleware.isAdmin, function(req, res){
    rent.find({}).lean().exec(function(err, allRent){
        var object = allRent;
        res.xls("rentdata.xlsx", object);
    });
});


app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

//PORT listen logic!
app.listen(8888, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});
  