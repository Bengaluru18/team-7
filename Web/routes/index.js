var express = require("express");
var router = express.Router();
var user = require("../models/user");
var sess;

function isLoggedIn(req, res, next) {
    if (req.session.email) {
        return next();
     } else {
        res.redirect("/login");
     }
}


router.get("/login", function(req, res){
    sess= req.session;
    if(sess.email)
    {
        res.redirect("/");
    }
    else {
    res.render("login"); 
}});

router.post("/login", function(req, res){
    sess= req.session;
    if (sess.email) {
        res.redirect("/");
    } else {
        user.findOne({"phone": req.body.phone}, function(err, foundUser){
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                if (foundUser) {
                    res.redirect("/");
                } else {
                    sess.email = foundUser['phone'];
                    sess.name = foundUser['name'];
                    sess.role = user['role'];
                    res.redirect("/");
                }
            }
        });
    }
}); 

router.get("/signup", function(req, res){
    if (sess.email) {
        res.redirect("/");
    } else {
        res.render("/signp");
    }
});

router.post("/signup", function(req, res){
    if (sess.email) {
        res.redirect("/");
    } else {
        req.body.user['role'] = 4;
        user.create(req.body.user, function(err, newUser){
            sess.email = user['phone'];
            sess.name = user['name'];
            sess.role = user['role'];
            res.redirect("/");
        });
    }
});

router.get("/logout",isLoggedIn, function(req, res){
    if (sess.email) {
        sess.destroy(function(err) {
            if(err) {
              console.log(err);
            } else {
              res.redirect('/');
            }
          });
    } else {
        req.flash("success", "Logged out!");
        res.redirect('/login');
    }
 });
 
 
 module.exports = router;