module.exports = async function(req, res, next) {
    if (req.session.user) {
        res.locals.isMine = req.session.user._id
    }
    next();
}