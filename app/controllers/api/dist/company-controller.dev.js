"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Company = require('../../db/models/company');

var fs = require('fs');

var CompanyController =
/*#__PURE__*/
function () {
  function CompanyController() {
    _classCallCheck(this, CompanyController);
  }

  _createClass(CompanyController, [{
    key: "showCompanies",
    value: function showCompanies(req, res) {
      var companies;
      return regeneratorRuntime.async(function showCompanies$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(Company.find({}));

            case 2:
              companies = _context.sent;
              res.status(200).json(companies);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      });
    }
    /* dla create, edit, delete ustawiam w Postman nagłówek:
        key: Authorization,
        value: Bearer 'i podaję token' wygenerowany przez middleware
        i zapisany w bazie MongoDB
        ... to tylko jeden z wielu rodzajów autoryzacji
    */

  }, {
    key: "createCompany",
    value: function createCompany(req, res) {
      var company;
      return regeneratorRuntime.async(function createCompany$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              company = new Company(_defineProperty({
                name: req.body.name,
                slug: req.body.slug,
                employeesCount: req.body.employeesCount,
                user: req.body.user
              }, "user", req.user._id));
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(company.save());

            case 4:
              res.status(201).json(company);
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](1);
              res.status(422).json({
                errors: _context2.t0.errors
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 7]]);
    }
  }, {
    key: "editCompany",
    value: function editCompany(req, res) {
      var slug, company;
      return regeneratorRuntime.async(function editCompany$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              slug = req.params.slug;
              _context3.next = 3;
              return regeneratorRuntime.awrap(Company.findOne({
                slug: slug
              }));

            case 3:
              company = _context3.sent;
              if (req.body.name) company.name = req.body.name;
              if (req.body.slug) company.slug = req.body.slug;
              if (req.body.employeesCount) company.employeesCount = req.body.employeesCount;

              if (req.file.filename && company.image) {
                fs.unlinkSync('public/uploads/' + company.image);
              }

              if (req.file.filename) {
                company.image = req.file.filename;
              }

              _context3.prev = 9;
              _context3.next = 12;
              return regeneratorRuntime.awrap(company.save());

            case 12:
              res.status(201).json(company);
              _context3.next = 18;
              break;

            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](9);
              res.status(422).json({
                errors: _context3.t0.errors
              });

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[9, 15]]);
    }
  }, {
    key: "deleteCompany",
    value: function deleteCompany(req, res) {
      var slug, company;
      return regeneratorRuntime.async(function deleteCompany$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              slug = req.params.slug;
              _context4.next = 3;
              return regeneratorRuntime.awrap(Company.findOne({
                slug: slug
              }));

            case 3:
              company = _context4.sent;

              if (company.image) {
                fs.unlinkSync('public/uploads/' + company.image);
              }

              _context4.prev = 5;
              _context4.next = 8;
              return regeneratorRuntime.awrap(Company.deleteOne({
                slug: slug
              }));

            case 8:
              //res.status(204).send(); // send a nie json bo nic nie przekazuję
              //lub...
              res.sendStatus(204);
              _context4.next = 14;
              break;

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](5);
              res.status(422).send({
                errors: 'Coś poszło nie tak'
              });

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[5, 11]]);
    }
  }]);

  return CompanyController;
}();

module.exports = new CompanyController();