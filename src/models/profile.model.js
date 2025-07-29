const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    age: {
        type: Number,
        required: [true, "Age is required"]
    },
    title: {
        type: String,
        default: "Flight Instructor"
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    },
    rating: {
        type: Number,
        default: 0
    },
    experience: {
        type: Number, // in years
        required: [true, "Experience is required"]
    },
    projects: {
        type: Number,
        required: [true, "Projects is required"]
    },
    description: {
        type: String
    },
    skills: [{
        type: String
    }],
    profileImage: {
        type: String, // You can store image URL or filename here
        default: ""
    },

    status: {
        type: String,
        default: true
    }
});

module.exports = mongoose.model('Instructor', instructorSchema);
