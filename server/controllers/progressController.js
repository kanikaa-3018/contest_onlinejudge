const UserProgress = require("../models/userProgress");

const getProgressByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await UserProgress.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No progress found for this email." });
    }

    res.json({
      email: user.email,
      followedSheets: user.followedSheets || [],
      progress: user.progress || {},
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getProgressByEmail };
