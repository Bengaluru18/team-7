var middlewareObj = {};
middlewareObj.isLoggedIn= function (req, res, next) {
    if (req.session.email) {
         next();
     } else {
        res.redirect("/login");
     }
}

middlewareObj.isAdmin = function (req, res, next) {
    if (req.session.email) {
        if (req.session.role == 0) {
            next();
        } else {
            res.redirect("/404");
        }
     } else {
        res.redirect("/login");
     }
}

middlewareObj.isBooked = function (req, res, next) {
    
}


module.exports = middlewareObj;