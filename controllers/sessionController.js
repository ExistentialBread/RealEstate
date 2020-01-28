module.exports.checkSess = 
function(req, res, next) {
    if (req.session && req.session.userId) {
        req.sess = true;
    }
    else {
        req.sess = false;
    }
    return next();
}

module.exports.requireLogin = 
function(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    return next();

}