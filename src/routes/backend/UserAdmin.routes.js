const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/backend/UserAdmin.controllers');
const UserAuthModel = require('../../models/UserAuth.model');




module.exports = app => {
    // Get all pending users
    router.get('/pending-users', adminController.getPendingUsers);
    // Approve a user
    router.post('/approve-user/:id', adminController.approveUser);
    // Reject a user
    router.post('/reject-user/:id', adminController.rejectUser);
    // Convert rejected user back to approved
    router.post('/convert-rejected-to-approved/:id', adminController.convertRejectedToApproved);
    // Get all approved or rejected users
    router.get('/all-actions', adminController.getAllActionsUsers);



    app.use('/api/backend/users', router)
}
//localhost:5000/api/backend/users/pending-users
//localhost:5000/api/backend/users/approve-user/64c199999999999999999999
//localhost:5000/api/backend/users/reject-user/64c199999999999999999999
//localhost:5000/api/backend/users/convert-rejected-to-approved/64c199999999999999999999
//localhost:5000/api/backend/users/all-actions