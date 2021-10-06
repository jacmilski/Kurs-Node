"use strict";

var User = require('../db/models/user');

module.exports = function _callee(req, res, next) {
  var token, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.headers.authorization.split(' ')[1];

          if (!token) {
            res.status(403).json({
              message: 'Brak tokena'
            });
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            apiToken: token
          }));

        case 4:
          user = _context.sent;
          console.log(user);

          if (!user) {
            res.status(403).json({
              message: 'Nie masz dostępu'
            });
          }

          req.user = user;
          next();

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};