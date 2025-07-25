const adminModel = require('../../models/AdminModel');

exports.login = async (req, res) => {
    try {
        const { adminName, adminPassword } = req.body;
        if (!adminName || !adminPassword) {
            return res.status(400).json({ success: false, message: 'adminName and adminPassword are required' });
        }

        const admin = await adminModel.findOne({ adminName, adminPassword });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid adminName or password' });
        }

        // For demo: plain text password check (in production, use hashed passwords)
        if (admin.adminPassword !== adminPassword) {
            return res.status(401).json({ success: false, message: 'Invalid adminName or password' });
        }

        // You can generate a JWT token here if needed
        return res.status(200).json({ success: true, message: 'Login successful', admin: { adminName: admin.adminName, _id: admin._id } });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}; 