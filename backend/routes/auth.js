const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const PasswordChangeRequest = require("../models/PasswordChangeRequest");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.currentUser = currentUser;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.post("/request-password-change", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingRequest = await PasswordChangeRequest.findOne({ user: user._id, status: "pending" });
    if (existingRequest) {
      return res.status(400).json({ message: "A password change request is already pending for this user." });
    }

    const requestedPassword = await bcrypt.hash(newPassword, 10);

    const passwordRequest = new PasswordChangeRequest({
      user: user._id,
      email: user.email,
      requestedPassword,
    });
    await passwordRequest.save();

    res.json({ message: "Password change request submitted. An admin will approve it." });
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

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "7d" });
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
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
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

router.get("/password-change-requests", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const requests = await PasswordChangeRequest.find({ status: "pending" }).populate("user", "username email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/password-change-requests/:id/approve", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const request = await PasswordChangeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") return res.status(400).json({ message: "Request is not pending" });

    const user = await User.findById(request.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = request.requestedPassword;
    await user.save();

    request.status = "approved";
    request.resolvedAt = new Date();
    await request.save();

    res.json({ message: "Password change request approved." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/password-change-requests/:id/reject", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const request = await PasswordChangeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") return res.status(400).json({ message: "Request is not pending" });

    request.status = "rejected";
    request.resolvedAt = new Date();
    await request.save();

    res.json({ message: "Password change request rejected." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
