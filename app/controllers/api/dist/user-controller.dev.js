"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var User = require('../../db/models/user');

var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, [{
    key: "login",
    value: function login(req, res) {
      var user, isValidPassword;
      return regeneratorRuntime.async(function login$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(User.findOne({
                email: req.body.email
              }));

            case 3:
              user = _context.sent;

              if (user) {
                _context.next = 6;
                break;
              }

              throw new Error('Nie ma takiego użytkownika');

            case 6:
              isValidPassword = user.comparePassword(req.body.password);

              if (isValidPassword) {
                _context.next = 9;
                break;
              }

              throw new Error('Hasło jest nieprawidłowe');

            case 9:
              // login
              res.status(200).json({
                apiToken: user.apiToken
              });
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              res.status(401).json({
                // Unauthorized
                message: 'Dostęp zabroniony!'
              });

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }]);

  return UserController;
}();

module.exports = new UserController();