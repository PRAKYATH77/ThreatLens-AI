const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Update user profile
router.patch("/profile", auth, async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const userId = req.user.userId;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if new username is already taken (only if username is being changed)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.status(400).json({ msg: "Username already taken" });
      }
    }

    // Check if new email is already taken (only if email is being changed)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) {
      // Validate role
      const validRoles = ['Admin', 'Developer', 'User', 'Analyst'];
      if (validRoles.includes(role)) {
        user.role = role;
      } else {
        return res.status(400).json({ msg: "Invalid role" });
      }
    }

    // Save updated user (with validation)
    await user.save();

    res.json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    
    res.status(500).json({ msg: error.message || 'Failed to update profile' });
  }
});

module.exports = router;