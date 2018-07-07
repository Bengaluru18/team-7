var user = require("../models/user");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");

router.get("/user",middleware.isAdmin, function(req, res){
    user.find({"role": "3"}, function(err, allUsers){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("user", {allUsers: allUsers});
        }
    });
});

router.get("/user/:id/approve",middleware.isAdmin, function(req, res){
    user.findByIdAndUpdate(req.params.id, {"status": "approved" },function(err, updatedUser){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            req.flash("success", "User approved!");
            res.redirect("/user");
        }
    });
});

router.get("/user/:id/delete",middleware.isAdmin, function(req, res){
    user.find(req.params.id, function(err, deletedUser){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            req.flash("success", "User deleted!");
            res.redirect("/user");
        }
    });
});

module.exports = router;