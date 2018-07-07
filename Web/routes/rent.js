var rent = require("../models/rent");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var creds = require("./creds");
router.use(creds);
router.use(middleware);

router.get("/rent", isAdmin, function(req, res){
    rent.find({}, function(err, allRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("rent", {allRent: allRent});
        }
    });
});


router.get("/rent/:id", isAdmin, function(req, res){
    rent.findById(req.params.id, function(err, foundRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("rentdet", {foundRent: foundRent});
        }
    });
});

router.get("/rent/:id/approve",isAdmin, function(req, res){
    rent.findByIdAndUpdate(req.params.id, {"status": "confirmed"}, function(err, updatedRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            req.flash("success", "Booking Status Updated!");
            
            var mailOptions = {
                from: 'Support'+'<hello@jaysinha.me>', 
                to: req.body.email, 
                subject: 'Booking Confirmed: ' + updatedRent['_id'], 
                html: 'Name: <b>' + foundUser['username'] + '</b><br>Password: <b>'+ foundUser['password'] + '</b>'// html body
            };

            var mailOptions2 = {
                from: 'Support'+'<hello@jaysinha.me>', 
                to: req.body.email, 
                subject: 'Booking Confirmed: ' + updatedRent['_id'], 
                html: 'Username: <b>' + foundUser['username'] + '</b><br>Password: <b>'+ foundUser['password'] + '</b>'// html body
            };
            res.redirect("/rent/"+updatedRent['_id']);
        }
    }); 
}); 


router.get("/rent/:id/approvePayment",isAdmin, function(req, res){
    rent.findByIdAndUpdate(req.params.id, {"pending_payment": "false"}, function(err, updatedRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            req.flash("success", "Payment Status updated!");
            res.redirect("/rent/"+updatedRent['_id']);
        }
    }); 
}); 

router.get("/rent/unpaid", isAdmin, function(req, res){
    rent.find({"status": "confirmed","pending_payment": "true"}, function(err, pendingRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            // req.flash("su")
            res.render("pending", {pendingRent: pendingRent});
        }
    });
});


router.get("/rent/unapproved", isAdmin, function(req, res){
    rent.find({"status": "unconfirmed"}, function(err, unconfirmedRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("unconfirmed", {unconfirmedRent: unconfirmedRent});
        }
    });
});

router.get("/rent/:id/cancel", isAdmin, function(req, res){
    rent.findByIdAndUpdate(req.params.id, {"status": "cancelled"}, function(err, foundRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            if (foundRent['pending_payment'] == "false" && foundRent['mode']=='Online') {
                //Logic to initiate refund from payment gateway

            } else {
                var mailOptions = {
                    from: 'Support'+'<hello@jaysinha.me>', 
                    to: req.body.email, 
                    subject: 'Booking Cancelled: ' + updatedRent['_id'], 
                    html: 'Name: <b>' + foundUser['username'] + '</b><br>Password: <b>'+ foundUser['password'] + '</b>'// html body
                };
    
                var mailOptions2 = {
                    from: 'Support'+'<hello@jaysinha.me>', 
                    to: req.body.email, 
                    subject: 'Booking Cancelled: ' + updatedRent['_id'], 
                    html: 'Username: <b>' + foundUser['username'] + '</b><br>Password: <b>'+ foundUser['password'] + '</b>'// html body
                };
                res.redirect("/rent");
            }
        }
    });
});


module.exports = router;