"use strict";

var express = require('express');

var router = new express.Router();

var CompanyController = require('../controllers/company-controller.js');

var UserController = require('../controllers/user-controller');

var PageController = require('../controllers/page-controller.js');

var upload = require('../services/uploader');

router.get('/', PageController.showHome);
router.get('/firmy', CompanyController.showCompanies);
router.get('/firmy/:name', CompanyController.showCompany);
router.get('/csv', CompanyController.getCSV);
router.get('/zarejestruj', UserController.showRegister);
router.post('/zarejestruj', UserController.register);
router.get('/zaloguj', UserController.showLogin);
router.post('/zaloguj', UserController.login);
router.get('/wyloguj', UserController.logout); //router.get('/firmy', UserController.login);

router.get('/admin/profil', UserController.showProfile);
router.post('/admin/profil', UserController.updateProfile);
router.get('/admin/firmy/dodaj', CompanyController.showCreateCompanyForm);
router.post('/admin/firmy/dodaj', CompanyController.createCompany);
router.get('/admin/firmy/:name/edytuj', CompanyController.showEditCompanyForm);
router.post('/admin/firmy/:name/edytuj', upload.single('image'), CompanyController.editCompany);
router.get('/admin/firmy/:name/usun', CompanyController.deleteCompany);
router.get('/admin/firmy/:name/usun-zdjecie', CompanyController.deleteImage);
router.get('*', PageController.showNotFound);
module.exports = router;