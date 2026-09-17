const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Strict email format and TLD validation
const validateEmail = (email) => {
  if (!email) return false;
  const trimmed = email.toLowerCase().trim();
  
  // Basic structure check
  const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!basicRegex.test(trimmed)) return false;

  // Reject typos like .co instead of .com (unless valid .co.in)
  if (trimmed.endsWith('.co') && !trimmed.endsWith('.co.in')) {
    return false;
  }

  // Enforce valid domain TLDs (.com, .in, .org, .net, .edu, .gov, .co.in, .io, .tech, etc.)
  const validTldRegex = /\.(com|in|org|net|edu|gov|co\.in|io|tech|info|me|dev)$/i;
  return validTldRegex.test(trimmed);
};

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (Name, Email, Password) are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({
        message: 'Invalid email address or domain typo (e.g. .co instead of .com). Please enter a valid email like user@gmail.com.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check existing user
    const existingUser = await get('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please login instead.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name.trim(), cleanEmail, hashedPassword]
    );

    const userId = result.id;

    // Create JWT Token
    const token = jwt.sign({ id: userId, email: cleanEmail }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address format (e.g. user@gmail.com).' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email. Please check your email or register.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Please try again or use Forgot Password.' });
    }

    // Token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

// Reset / Forgot Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address format.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

    res.json({ message: 'Password reset successfully! You can now log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error resetting password. Please try again.' });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const user = await get('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
};

module.exports = {
  register,
  login,
  resetPassword,
  getMe
};
