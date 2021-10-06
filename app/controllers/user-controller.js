const User = require('../db/models/user');

class UserController {
    showRegister(req, res) {
        res.render('./pages/auth/register')
    }

    async register(req, res) {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
        });

        try {
            await user.save();
            res.redirect('/zaloguj');

        } catch(e) {

            res.render('pages/auth/register', {
                errors: e.errors,
                form: req.body,
            });
        }
    }

    showLogin(req, res) {
        res.render('pages/auth/login');
    }

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
            req.session.user = {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
            res.redirect('/');

        } catch(error) {
            res.render('pages/auth/login', {
                form: req.body,
                errors: true,
            })
        }
    }

    // logout
    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    // edit profile
    showProfile(req, res) {
        res.render('pages/auth/profile', {
            form: req.session.user
        });
    }

    async updateProfile(req, res) {

        const user = await User.findById(req.session.user._id);

        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;

        if (req.body.password) {
            user.password = req.body.password;
        }

        try {
            await user.save();
            req.session.user = user;
            res.redirect('back') // zamiast '/admin/profil'
        } catch(e) {
            res.render('pages/auth/profile', {
                errors: e.errors,
                form: req.body,
            })
        }
    }
}

module.exports = new UserController();