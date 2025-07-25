const UserAuthModel = require('../../models/UserAuth.model');

// Get all users with status 'pending'
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await UserAuthModel.find({ status: 'pending' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending users', error: err.message });
  }
};

// Approve a user by ID
exports.approveUser = async (req, res) => {
  try {
    await UserAuthModel.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ message: 'User approved!' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving user', error: err.message });
  }
};

// Reject a user by ID
exports.rejectUser = async (req, res) => {
  try {
    await UserAuthModel.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ message: 'User rejected!' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting user', error: err.message });
  }
};

// Convert rejected user back to approved status
exports.convertRejectedToApproved = async (req, res) => {
  try {
    const user = await UserAuthModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (user.status !== 'rejected') {
      return res.status(400).json({ message: 'User is not in rejected status!' });
    }

    await UserAuthModel.findByIdAndUpdate(req.params.id, {
      status: 'approved',
      updatedAt: new Date()
    });

    res.json({
      status: true,
      message: 'Rejected user successfully converted to approved!',
      user: {
        name: user.name,
        email: user.email,
        status: 'approved',
        updatedAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error converting user status', error: err.message });
  }
};

// Get all users with status 'approved' or 'rejected'
exports.getAllActionsUsers = async (req, res) => {
  try {
    const users = await UserAuthModel.find({ status: { $in: ['approved', 'rejected'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
}; 