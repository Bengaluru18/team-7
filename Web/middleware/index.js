function isLoggedIn(req, res, next) {
    if (req.session.email) {
        return next();
     } else {
        res.redirect("/login");
     }
}

function isAdmin(req, res, next) {
    if (req.session.email) {
        if (req.session.role == 0) {
            return next();
        } else {
            res.redirect("/404");
        }
     } else {
        res.redirect("/login");
     }
}

function isBooked(req, res, next) {
    
}