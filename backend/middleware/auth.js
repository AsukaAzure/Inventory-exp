const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to prevent viewers from modifying data
const requireNonViewer = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "viewer") {
      return res.status(403).json({ message: "Viewer role cannot perform this action" });
    }
    req.currentUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = authMiddleware;
module.exports.requireNonViewer = requireNonViewer;
