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
        res.redirect("/dashboard");
    }
    else {
    res.render("login"); 
}});



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