var rent = require("../models/rent");
var inventory = require("../models/inventory");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var creds = require("../creds");
var nodemailer = require('nodemailer');
router.get("/rent", middleware.isLoggedIn, function(req, res){
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
            res.render("listing", {allInventory: inv});
        }
    });
});

router.get("/admin/rent", middleware.isAdmin, function(req, res){
    rent.find({"status": "pending"}, function(err, allRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            
            res.render("rent", {allRent: allRent});
        }
    });
});



router.get("/rent/:id/approve/:mname",middleware.isAdmin, function(req, res){
    inventory.findOne({"name": req.params.mname}, function(err, foundInventory){
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
                to: 'hello@jaysinha.me', 
                subject: 'Booking Confirmed: ' + updatedRent['_id'], 
                html: 'Name: <b>' + updatedRent['name'] + '</b><br>Name: <b>'+ updatedRent['mname'] + '</b>'// html body
            };

            var mailOptions2 = {
                from: 'Support'+'<hello@jaysinha.me>', 
                to: 'razor.sinha.08@gmail.com', 
                subject: 'Booking Approved: ' + updatedRent['_id'], 
                html: 'Name: <b>' + updatedRent['name'] + '</b><br>Name: <b>'+ updatedRent['mname'] + '</b>'// html body
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

            transporter.sendMail(mailOptions2, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

            var message = 'Machine Ordered: ' + updatedRent['mname'] + '. Our executive will get in touch with you shortly. Team ISAP!';
                msg91.send("91" + updatedRent['phone'], message, function(err, response){
                    // console.log(err);
                    console.log(response);
            });
            msg91.send("918090167640", message, function(err, response){
                // console.log(err);
                console.log(response);
        });

            res.redirect("/admin/rent");
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

            var message = 'Machine Ordered: ' + updatedRent['mname'] + '. Payment Approved. Team ISAP!';
                creds.msg91.send(updatedRent['phone'], message, function(err, response){
                    // console.log(err);
                    console.log(response);
            });
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
            res.render("pending", {allRent: pendingRent});
        }
    });
});


router.get("/rent/unapproved", middleware.isAdmin, function(req, res){
    rent.find({"status": "unconfirmed"}, function(err, unconfirmedRent){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("unconfirmed", {allRent: unconfirmedRent});
        }
    });
});

router.get("/rent/:id/cancel/:mname", middleware.isAdmin, function(req, res){
    inventory.findOne({"name": req.params.mname}, function(err, foundInventory){
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
                    to: 'razor.sinha.08@gmail.com', 
                    subject: 'Booking Cancelled: ' + updatedRent['_id'], 
                    html: 'Name: <b>' + updatedRent['name'] + '</b><br>Name: <b>'+ updatedRent['mname'] + '</b>'// html body
                };

                creds.transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
    
    
                var message = 'Service Cancelled: ' + updatedRent['mname'] + '. Our executive will get in touch with you shortly. Team ISAP!';
                    creds.msg91.send(updatedRent['phone'], message, function(err, response){
                        // console.log(err);
                        console.log(response);
                });

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
});


router.get("/rent/:id/return",middleware.isLoggedIn, function(req, res){
    rent.findByIdAndUpdate(req.params.id, {"status": "completed"},function(err, foundRent){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            inventory.findOneAndUpdate({"name": foundRent['mname']}, {$inc: {"quantity": 1}});
            res.redirect("/");
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

module.exports = router;