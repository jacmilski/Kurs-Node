const User = require('../db/models/user'); 

module.exports = async function(req, res, next) {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            message: 'Brak tokena'
        });
    }

    const user = await User.findOne({apiToken: token});

    if (!user) {
        return res.status(403).json({
            message: 'Nie masz dostępu',
        });
    }
    req.user = user;
    next();
}