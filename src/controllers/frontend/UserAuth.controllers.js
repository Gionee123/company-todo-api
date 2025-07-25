const userModel = require('../../models/UserAuth.model');
const bcrypt = require('bcryptjs') //पासवर्ड को हैश करने के लिए।
var jwt = require('jsonwebtoken') //लॉगिन के बाद यूज़र को ऑथेंटिकेट करने के लिए।
var secretKey = 'Gionee123'; // JWT को सुरक्षित बनाने के लिए।


exports.register = async (request, response) => {
    try {
        console.log('📝 Register request received:', request.body);

        const { name, email, password, role = 'user' } = request.body; // 👈 default role 'user'

        // Validate required fields
        if (!name || !email || !password) {
            console.log('❌ Validation failed: Missing required fields');
            return response.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }


        const existingUser = await userModel.findOne({ email: request.body.email }); //सबसे पहले चेक करता है कि यूज़र पहले से रजिस्टर है या नहीं।

        if (existingUser) {
            return response.status(400).json({
                status: false,
                message: "Email ID already registered!" //अगर ईमेल पहले से मौजूद है, तो "Email ID already registered!" मैसेज भेजता है।

            });
        }

        // नया यूज़र बनाएं
        var data = new userModel({
            name: request.body.name,
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, 10),
            isVerified: true, // <-- यह जोड़ो!
            status: role === 'admin' ? "approved" : "pending", // Admin ke liye auto-approved
            role: role || 'user'

        })
        // यूज़र को डेटाबेस में सेव करें

        await data.save().then((result) => {
            // JWT टोकन जेनरेट करें
            console.log('✅ User registered successfully:', result.email);

            var token = jwt.sign({
                userData: result
            },
                secretKey,
                { expiresIn: '1h' });

            response.status(201).json({
                status: true,
                message: "User registered successfully!",
                token: token,
                role: result.role
            });
        }).catch((error) => {
            console.error('❌ Registration failed:', error.message);
            response.status(500).json({
                status: false,
                message: "Registration failed!",
                error: error.message
            });
        });

    } catch (error) {
        console.error('❌ Server error in register:', error.message);
        response.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.login = async (request, response) => {
    try {
        console.log('🔐 Login request received:', { email: request.body.email, role: request.body.role });

        const { email, password, role } = request.body;

        // Validate required fields for login
        if (!email || !password) {
            console.log('❌ Login validation failed: Missing email or password');
            return response.status(400).json({
                status: false,
                message: "Email and password are required",
            });
        }
        await userModel.findOne({ email: email, role: role })
            .then((result) => {
                let resp;
                if (result) {
                    if (result.status === 'pending' && result.role !== 'admin') {
                        resp = {
                            status: false,
                            message: 'Your account is not approved yet.'
                        }
                    } else {
                        var comparePassword = bcrypt.compareSync(password, result.password);
                        if (comparePassword) {
                            var token = jwt.sign({
                                userData: result
                            },
                                secretKey,
                                { expiresIn: '1h' });
                            resp = {
                                status: true,
                                message: "login successfully",
                                token: token,
                                role: result.role
                            }
                        } else {
                            resp = {
                                status: false,
                                message: "Incorrect password."
                            }
                        }
                    }
                } else {
                    resp = {
                        status: false,
                        message: "Invalid credentials."
                    }
                }
                response.send(resp)
            })
            .catch((error) => {
                console.error('❌ Login error:', error.message);
                response.status(500).json({
                    status: false,
                    message: "Something went wrong!",
                    error: error.message
                });
            });

    } catch (error) {
        console.error('❌ Server error in login:', error.message);
        response.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.profile = async (request, response) => {
    try {
        let token = request.headers.authorization;

        if (!token || token === "") {
            return response.status(401).json({
                status: false,
                token_error: true,
                message: "Token required",
            });
        }

        // Remove 'Bearer ' from token if present
        token = token.replace("Bearer ", "");

        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return response.status(401).json({
                    status: false,
                    token_error: true,
                    message: "Invalid or expired token",
                });
            }

            // ✅ Response सिर्फ एक बार भेजा जाएगा
            return response.json({
                status: true,
                token_error: false,
                message: "Token verified successfully",
                data: decoded,
            });
        });

    } catch (error) {
        // 🔴 अगर कोई भी अन्य एरर आती है तो उसे catch करेंगे
        console.error("Server Error:", error);

        return response.status(500).json({
            status: false,
            token_error: true,
            message: "Internal Server Error",
        });
    }
};


