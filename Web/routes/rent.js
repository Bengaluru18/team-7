var rent = require("../models/rent");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var creds = require("../creds");

router.get("/rent", middleware.isAdmin, function(req, res){
    rent.find({}, function(err, allRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("rent", {allRent: allRent});
        }
    });
});


router.get("/rent/:id", middleware.isAdmin, function(req, res){
    rent.findById(req.params.id, function(err, foundRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("rentdet", {foundRent: foundRent});
        }
    });
});

router.get("/rent/:id/approve",middleware.isAdmin, function(req, res){
    inventory.findOne({"name": req.body.rent.mname}, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
        
    rent.findByIdAndUpdate(req.params.id, {"status": "confirmed"}, function(err, updatedRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            req.flash("success", "Booking Status Updated!");
            inventory.findByIdAndUpdate(foundInventory['_id'], {"quantity": foundInventory['quantity']-1});
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
}
}); 


router.get("/rent/:id/approvePayment",middleware.isAdmin, function(req, res){
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

router.get("/rent/unpaid", middleware.isAdmin, function(req, res){
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


router.get("/rent/unapproved", middleware.isAdmin, function(req, res){
    rent.find({"status": "unconfirmed"}, function(err, unconfirmedRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("unconfirmed", {unconfirmedRent: unconfirmedRent});
        }
    });
});

router.get("/rent/:id/cancel", middleware.isAdmin, function(req, res){
    inventory.findOne({"name": req.body.rent.mname}, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
        
        if (foundInventory['quantity'] > 0) {
    rent.findByIdAndUpdate(req.params.id, {"status": "cancelled"}, function(err, foundRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            inventory.findByIdAndUpdate(foundInventory['_id'], {"quantity": foundInventory['quantity']+1});

            if (foundRent['pending_payment'] == "false" && foundRent['mode']=='Online') {
                //Logic to initiate refund from payment gateway

            } else {
                var mailOptions = {
                    from: 'Support'+'<hello@jaysinha.me>', 
                    to: req.body.email, 
                    subject: 'Booking Cancelled: ' + updatedRent['_id'], 
                    html: 'Name: <b>' + foundUser['username'] + '</b><br>Password: <b>'+ foundUser['password'] + '</b>'// html body
                };
    
                res.redirect("/rent");
            }
        }
    });
} else {
    res.send({"success": false, "quantity": 0});
}
        }
        });
    
});


module.exports = router;