const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { generateJwtToken } = require("../utils/jwt"); 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, role: "user" });
    }

    const appToken = generateJwtToken(user);
    res.json({
      token: appToken,
      _id: user._id,
      role: user.role,
      cfHandle: user.cfHandle,
      lcHandle: user.lcHandle,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
