const express = require('express');
const router = new express.Router();
const CompanyController = require('../controllers/api/company-controller');
const UserController = require('../controllers/api/user-controller');
const upload = require('../services/uploader');
const authMiddleware = require('../middleware/is-auth-api-middleware');

router.post('/login', UserController.login)
router.get('/companies', CompanyController.showCompanies);
router.post('/companies', authMiddleware, CompanyController.createCompany);
router.put('/companies/:slug', authMiddleware, upload.single('image'),CompanyController.editCompany);
router.delete('/companies/:slug', authMiddleware, CompanyController.deleteCompany);

module.exports = router;