const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
// Change Password without old password
router.post("/changepassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Delete user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Only allow "admin" or "user" roles
    if (!["admin", "user"].includes(role)) {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username, email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, username: user.username, email , role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  // Client should delete token manually from storage
  res.json({ message: "Logged out successfully. Please remove token on client side." });
});

module.exports = router;
