var inventory = require("../models/inventory");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");


router.get("/inventory", middleware.isAdmin, function(req, res){
    inventory.find({}, function(err, allInventory){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("inventory", {allInventory: allInventory});
        }
    });
});

router.post("/inventory", middleware.isAdmin,function(req, res){
    inventory.create(req.body.inventory, function(err, newInventory){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            req.flash("success", "New Inventory Added");
            res.redirect("/inventory/"+newInventory['_id']);
        }
    });
});

router.get("/inventory/:id", middleware.isAdmin,function(req, res){
    inventory.findOne({"_id": req.params.id}, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            res.render("inventorydet", {inventory: foundInventory});
        }
    });
});

router.get("/inventory/:id/delete", middleware.isAdmin,function(req, res){
    inventory.deleteOne({"_id": req.params.id}, function(err, foundInventory){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            req.flash("success", "Deleted Inventory");
            res.redirect("/inventory");
        }
    });
});

router.put("/inventory/:id/update", middleware.isAdmin,function(req, res){
    inventory.findByIdAndUpdate(req.params.id, req.body.inventory, function(err, updatedInventory){
        if (err) {
            console.log(err);
            res.redirect("/404");
        } else {
            req.flash("success", "Updated Inventory");
            res.render("/inventory");
        }
    });
});

module.exports = router;
