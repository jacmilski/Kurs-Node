const User = require('../../db/models/user');

class UserController {

    async login(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user) {
                throw new Error('Nie ma takiego użytkownika')
            }

            const isValidPassword = user.comparePassword(req.body.password);
            if (!isValidPassword) {
                throw new Error('Hasło jest nieprawidłowe')
            }
            // login
            res.status(200).json({apiToken: user.apiToken})

        } catch(error) {
            res.status(401).json({ // Unauthorized
                message: 'Dostęp zabroniony!'
            })
        }
    }
}

module.exports = new UserController();