const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs"); // Ensure this is imported for manual hashing if needed

const attachCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    signed: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 Day
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Hash password manually before creating (consistent with your previous logic)
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = user.createJWT();
    attachCookie(res, token);

    res.status(StatusCodes.CREATED).json({ user: user.username });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(`[AUTH] Login attempt for: ${email}`);

  if (!email || !password) {
    console.log("[AUTH] Missing email or password");
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[AUTH] User not found: ${email}`);
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid Credentials" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      console.log(`[AUTH] Password mismatch for: ${email}`);
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid Credentials" });
    }

    const token = user.createJWT();
    // Set cookie for compatibility, but also return token in body for frontend dev usage
    attachCookie(res, token);

    console.log(`[AUTH] Login successful for: ${email}`);
    res.status(StatusCodes.OK).json({
      user: { email: user.email, username: user.username, role: user.role },
      token,
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Login error: " + error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out" });
};

module.exports = { register, login, logout };