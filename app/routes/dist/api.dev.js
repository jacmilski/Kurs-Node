"use strict";

var express = require('express');

var router = new express.Router();

var CompanyController = require('../controllers/api/company-controller');

var UserController = require('../controllers/api/user-controller');

var upload = require('../services/uploader');

var authMiddleware = require('../middleware/is-auth-api-middleware');

router.post('/login', UserController.login);
router.get('/companies', CompanyController.showCompanies);
router.post('/companies', authMiddleware, CompanyController.createCompany);
router.put('/companies/:slug', authMiddleware, upload.single('image'), CompanyController.editCompany);
router["delete"]('/companies/:slug', authMiddleware, CompanyController.deleteCompany);
module.exports = router;