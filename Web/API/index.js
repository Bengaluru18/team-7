var inventory = require("../models/inventory");
var user = require("../models/user");
var rent = require("../models/rent");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var creds = require("../creds");
router.get("/api/rent/:id", function(req, res){
    
    rent.findById(req.params.id, function(err, foundRent){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            res.send({"rent": foundRent, "success": true});
        }
    });
});

router.post("/api/rent/", function(req, res){
    inventory.findOne({"name": req.body.rent.mname}, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
        
        if (foundInventory['quantity'] > 0) {
        rent.create(req.body.rent, function(err, newRent){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            // inventory.findByIdAndUpdate(foundInventory['_id'], {"quantity": foundInventory['quantity']-1});
            var mailOptions = {
                from: newRent['name']+'<hello@jaysinha.me>', 
                to: 'hello@jaysinha.me', 
                subject: 'Booking Requested: ' + newRent['_id'], 
                html: 'Name: <b>' + newRent['name']+"</b><br>Approve Link: " + "/api/rent/"+newRent['_id'] +"/approve"     // html body
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

            res.send({"success": true, "rent": newRent});
        }
    });
}
else {
    res.send({"success": false, "quantity": 0});
} 
}
});
});

router.get("/api/rent/:id/cancel", function(req, res){
    inventory.findOne({"name": req.body.rent.mname}, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
        
    rent.findByIdAndUpdate(req.params.id, {"status": "cancelled"}, function(err, foundRent){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            inventory.findByIdAndUpdate(foundInventory['_id'], {"quantity": foundInventory['quantity']+1});
            if (foundRent['pending_payment'] == "false" && foundRent['mode']=='Online') {
                //Logic to initiate refund from payment gateway

            } else {
                inventory.findOneAndUpdate({"name": foundRent['mname']}, {$inc: {"quantity": 1}});
                var mailOptions = {
                    from: 'Support'+'<hello@jaysinha.me>', 
                    to: req.body.email, 
                    subject: 'Booking Cancelled: ' + updatedRent['_id'], 
                    html: 'Name: <b>' + foundUser['username'] + '</b><br>Password: <b>'+ foundUser['password'] + '</b>'// html body
                };
                res.send({"success": true});
            }
        }
    });
}
});

router.get("/api/rent/:id/approve", function(req, res){
    inventory.findOne({"name": req.body.rent.mname}, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
        
        if (foundInventory['quantity'] > 0) {
    rent.findByIdAndUpdate(req.params.id, {"status": "confirmed"}, function(err, updatedRent){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            
            inventory.findByIdAndUpdate(foundInventory['_id'], {"quantity": foundInventory['quantity']-1});
            var mailOptions = {
                from: 'Support'+'<hello@jaysinha.me>', 
                to: req.body.email, 
                subject: 'Booking Approved: ' + updatedRent['_id'], 
                html: 'Name: <b>' + updatedRent['name'] + '</b><br>Booking Date: <b>' + updatedRent['startDate'] + " - " + updatedRent['endDate']+"</b>"// html body
            };

            var mailOptions = {
                from: 'Support'+'<hello@jaysinha.me>', 
                to: updatedRent['email'], 
                subject: 'Booking Approved: ' + updatedRent['_id'], 
                html: 'Name: <b>' + updatedRent['name'] + '</b><br>Booking Date: <b>' + updatedRent['startDate'] + " - " + updatedRent['endDate']+"</b>"// html body
            };

            
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

            res.send({"success": true, "rent": updatedRent});
        }
    });

}   else {
    res.send({"success": false, "quantity": 0});
    }
}
    });
});
}); 


router.post("/api/register", function(req, res){
    user.findOne({"phone": req.body.user.phone}, function(err, foundUser) {
        if (foundUser) {
    user.create(req.body.user, function(err, newUser){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            res.send({"success": true, "user": newUser})
        }
    });
} else {
    res.send({"success": false, "message": "User already there!"});
}
});
});


router.get("/api/user/:id", function(req, res){
    user.find({"phone": req.body.user.phone}, function(err, foundUser) {
        if (err) {
            console.log(err);
            res.send({"success": false});
        }  else {
            if (foundUser) {
                res.send({"success": false, "user": foundUser});
            } else {
                res.send({"success": false, "message": "User not found!"});
            }
        }
    });
});

router.get("/api/inventory/", function(req, res){
    inventory.find({}, function(err, allInventory){
        if (err) {
            console.log(err);
            res.send({"success": true});
        } else {
            var inv = [];
            allInventory.forEach(function(x){
                if (x['quantity'] > 0) {
                    inv.push(x);
                }
                res.send({"success": true, "inventory": inv}); 
            });
        }
    });
});

router.get("/api/rent/:id/return", function(req, res){
    rent.findByIdAndUpdate(req.params.id, {"status": "completed"},function(err, foundRent){
        if (err) {
            console.log(err);
            res.send({"success": false});
        } else {
            inventory.findOneAndUpdate({"name": foundRent['mname']}, {$inc: {"quantity": 1}});
            res.send({"success": true, "rent": foundRent});
        }
    });
});

module.exports = router;