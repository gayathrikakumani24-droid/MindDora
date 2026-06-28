const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const client = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'minddora_secret_jwt_key_for_local_development', {
    expiresIn: '30d',
  });
};

/**
 * Register User
 * POST /api/auth/register
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        mentorPreference: user.mentorPreference,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          mentorPreference: user.mentorPreference,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Google Login Verification
 * POST /api/auth/google
 */
const googleLogin = async (req, res) => {
  const { token, email: devEmail, name: devName } = req.body;

  try {
    let email, name, googleId, avatar;

    if (client && token) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
      avatar = payload.picture;
    } else {
      // Local development fallback/testing if Google Client ID is unconfigured
      console.warn('GOOGLE_CLIENT_ID is not configured. Processing dev fallback Google Login.');
      if (!devEmail) {
        return res.status(400).json({
          success: false,
          message: 'GOOGLE_CLIENT_ID not configured, and dev fallback email is missing.',
        });
      }
      email = devEmail;
      name = devName || 'Dev User';
      googleId = `google_dev_${email}`;
      avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        mentorPreference: user.mentorPreference,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Google authentication failed' });
  }
};

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate recovery token (30 mins validity)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins

    await user.save();

    // Since we don't have a mail server configured, we output the URL in the terminal
    // and send the raw token to the client. This makes local developer verification direct!
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log(`[PASSWORD RESET TRIGGERED] User: ${email}. URL: ${resetUrl}`);

    res.json({
      success: true,
      message: 'Password reset link simulated. Check backend server console logs.',
      token: resetToken, // also sending it back to simplify testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Reset Password
 * POST /api/auth/reset-password/:token
 */
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Profile
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Mentor Preference
 * PUT /api/auth/me/mentor
 */
const updateMentorPreference = async (req, res) => {
  const { mentorPreference } = req.body;

  try {
    if (!['career', 'study', 'productivity', 'wellness'].includes(mentorPreference)) {
      return res.status(400).json({ success: false, message: 'Invalid mentor preference' });
    }

    const user = await User.findById(req.user._id);
    user.mentorPreference = mentorPreference;
    await user.save();

    res.json({ success: true, mentorPreference: user.mentorPreference });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateMentorPreference,
};
