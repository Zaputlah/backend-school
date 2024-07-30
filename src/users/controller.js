const User = require('./model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// controllers/userController.js
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'superadmin' // Default role
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role, user.username, user.email)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// controllers/userController.js
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User:', user);

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id, user.role, user.username, user.email)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { id } = req.params; // Ambil ID dari parameter URL
    const user = await User.findById(id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            token: generateToken(updatedUser._id, updatedUser.username, updatedUser.email)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Ambil ID dari parameter URL
    const user = await User.findById(id);

    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};