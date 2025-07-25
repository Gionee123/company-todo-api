const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
        unique: true
    },
    adminPassword: {
        type: String,
        required: true
    }
}, { timestamps: true });

const adminModel = mongoose.model('Admin', AdminSchema);

module.exports = adminModel; 