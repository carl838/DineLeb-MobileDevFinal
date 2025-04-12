const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/users/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10)
    });

    // 3. Save to database
    await user.save();

    // 4. Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token });
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
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Update last login
    user.lastLogin = new Date();
    await user.save();

    // 4. Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get user profile
// @route   GET /api/users/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password') // Exclude password
      .populate('favorites', 'name image'); // Populate favorites

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add/remove restaurant from favorites
// @route   PUT /api/users/favorites
exports.toggleFavorite = async (req, res) => {
  const { restaurantId } = req.body;

  try {
    const user = await User.findById(req.userId);
    const index = user.favorites.indexOf(restaurantId);

    if (index === -1) {
      // Add to favorites
      user.favorites.push(restaurantId);
    } else {
      // Remove from favorites
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.deleteUser = async (req, res) => {
  try {
    // Find the user
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Delete the user's account
    await User.findByIdAndRemove(req.userId);
    
    res.json({ msg: 'User account deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};