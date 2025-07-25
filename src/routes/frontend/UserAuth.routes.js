const express = require('express')
const route = express.Router();
const usercontroller = require("../../controllers/frontend/UserAuth.controllers");

module.exports = app => {
    // Test endpoint to check if API is working
    route.get('/test', (req, res) => {
        res.json({
            status: true,
            message: "API is working!",
            timestamp: new Date().toISOString()
        });
    });

    route.post('/register', usercontroller.register);
    //http://localhost:5000/api/frontend/users/register
    route.post('/login', usercontroller.login);
    //http://localhost:5000/api/frontend/users/login
    route.post('/profile', usercontroller.profile);
    //http://localhost:5000/api/frontend/users/profile

    app.use('/api/frontend/users', route)
}