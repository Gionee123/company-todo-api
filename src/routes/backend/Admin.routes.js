const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/backend/adminAuth.controller');

// Admin login route
router.post('/login', adminAuthController.login);

module.exports = app => {
    app.use('/api/backend/adminAuth', router);
};
//http://localhost:5000/api/backend/adminAuth/login