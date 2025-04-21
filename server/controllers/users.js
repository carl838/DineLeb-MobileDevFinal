const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/users/register
exports.register = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    user = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Login user
// @route   POST /api/users/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    res.json({
      msg: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        favorites: user.favorites || []
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get user profile logged in 
// @route   GET /api/users/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('favorites', 'name image');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Toggle favorite restaurant
// @route   PUT /api/users/favorites
exports.toggleFavorite = async (req, res) => {
  const { restaurantId } = req.body;

  try {
    const user = await User.findById(req.userId);
    const index = user.favorites.indexOf(restaurantId);

    if (index === -1) {
      user.favorites.push(restaurantId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete user
// @route   DELETE /api/users/me
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndRemove(req.userId);
    res.json({ msg: 'User account deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all users (public)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Hide passwords
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};