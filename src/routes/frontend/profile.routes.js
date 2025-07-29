const express = require('express');
const route = express.Router();
const usercontroller = require("../../controllers/frontend/profile.controller");
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/Images' })

// 🟢 Multer storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/Images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const imagepath = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + imagepath);
    }
});

const uploadImage = multer({ storage: storage }).single('image');
const uploadNone = multer().none(); // For handling form-data with no files

module.exports = app => {

    console.log('🔄 Registering frontend user routes...');

    // ✅ Create profile with image (form-data + image)
    route.post('/create', uploadImage, usercontroller.create);
    // http://localhost:5000/api/frontend/users/create

    // ✅ View profiles using form-data (if needed)
    route.post('/view', uploadNone, usercontroller.view);
    // http://localhost:5000/api/frontend/users/view

    // ✅ Get profile details (send id in form-data)
    route.post('/details/:id', uploadNone, usercontroller.details);
    // http://localhost:5000/api/frontend/users/details

    // ✅ Apply all under this base route
    app.use('/api/frontend/users', route);


};
