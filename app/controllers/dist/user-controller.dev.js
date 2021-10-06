"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var User = require('../db/models/user');

var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, [{
    key: "showRegister",
    value: function showRegister(req, res) {
      res.render('./pages/auth/register');
    }
  }, {
    key: "register",
    value: function register(req, res) {
      var user;
      return regeneratorRuntime.async(function register$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              user = new User({
                email: req.body.email,
                password: req.body.password
              });
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap(user.save());

            case 4:
              res.redirect('/zaloguj');
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](1);
              res.render('pages/auth/register', {
                errors: _context.t0.errors,
                form: req.body
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[1, 7]]);
    }
  }, {
    key: "showLogin",
    value: function showLogin(req, res) {
      res.render('pages/auth/login');
    }
  }, {
    key: "login",
    value: function login(req, res) {
      var user, isValidPassword;
      return regeneratorRuntime.async(function login$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(User.findOne({
                email: req.body.email
              }));

            case 3:
              user = _context2.sent;

              if (user) {
                _context2.next = 6;
                break;
              }

              throw new Error('Nie ma takiego użytkownika');

            case 6:
              isValidPassword = user.comparePassword(req.body.password);

              if (isValidPassword) {
                _context2.next = 9;
                break;
              }

              throw new Error('Hasło jest nieprawidłowe');

            case 9:
              // login
              req.session.user = {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
              };
              res.redirect('/');
              _context2.next = 16;
              break;

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](0);
              res.render('pages/auth/login', {
                form: req.body,
                errors: true
              });

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 13]]);
    } // logout

  }, {
    key: "logout",
    value: function logout(req, res) {
      req.session.destroy();
      res.redirect('/');
    } // edit profile

  }, {
    key: "showProfile",
    value: function showProfile(req, res) {
      res.render('pages/auth/profile', {
        form: req.session.user
      });
    }
  }, {
    key: "updateProfile",
    value: function updateProfile(req, res) {
      var user;
      return regeneratorRuntime.async(function updateProfile$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(User.findById(req.session.user._id));

            case 2:
              user = _context3.sent;
              user.email = req.body.email;
              user.firstName = req.body.firstName;
              user.lastName = req.body.lastName;

              if (req.body.password) {
                user.password = req.body.password;
              }

              _context3.prev = 7;
              _context3.next = 10;
              return regeneratorRuntime.awrap(user.save());

            case 10:
              req.session.user = user;
              res.redirect('back'); // zamiast '/admin/profil'

              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](7);
              res.render('pages/auth/profile', {
                errors: _context3.t0.errors,
                form: req.body
              });

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[7, 14]]);
    }
  }]);

  return UserController;
}();

module.exports = new UserController();