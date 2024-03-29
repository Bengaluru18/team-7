var express = require("express");
var router = express.Router();
var user = require("../models/user");
var sess;
var fileUpload = require('express-fileupload');
var path = require('path'),
    fs = require('fs');
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
                if (!foundUser) {
                    res.redirect("/");
                } else {
                    if (req.body.password == foundUser['password']) {
                    sess.email = foundUser['phone'];
                    sess.name = foundUser['name'];
                    sess.role = foundUser['role'];
                    console.log(req.session.email);
                    res.redirect("/");
                    } else {
                        res.redirect("/");
                    }
                }
            }
        });
    }
}); 

router.get("/signup", function(req, res){
    var sess = req.session;
    if (sess.email) {
        res.redirect("/");
    } else {
        res.render("signup");
    }
});

router.post("/signup", function(req, res){
    sess = req.session;
    if (sess.email) {
        res.redirect("/");
    } else {
        console.log(req.body.user);
        req.body.user['role'] = 4;
        req.body.user['status'] = false;
        user.create(req.body.user, function(err, newUser){
            sess.email = newUser['phone'];
            sess.name = newUser['name'];
            sess.role = newUser['role'];
            // var sampleFile = req.files.file;
        
    // if (path.extname(req.files.file.name).toLowerCase() === '.png') {
    //     sampleFile.mv('./uploads/'+ req.body.phone + '.png', function(err) {
    //         if (err)
    //           return res.status(500).send(err);
         
    //         console.log('Upload');
    //       }); 
    // }
    //  else {
    //     fs.unlink(tempPath, function () {
    //         if (err) throw err;
    //         console.error("Only .png files are allowed!");
    //     });
    // }
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