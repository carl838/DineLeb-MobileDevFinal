const admin = require('../firebase');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Register a new user via Firebase and save in MongoDB
// @route   POST /api/users/register
exports.register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
 
  try {
    // 1. Create the user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
 
    const verifyLink = await admin.auth().generateEmailVerificationLink(email);
 
    // 2. Save the user in MongoDB
    const newMongoUser = new User({
      name,
      email,
      phoneNumber,
      password, // even though firebase manages login, you might want to store it for reference (or leave blank if needed)
      firebaseUID: userRecord.uid, // ✅ store the Firebase UID too
      createdAt: new Date(),
      lastLogin: new Date()
    });
 
    await newMongoUser.save();
 
    res.status(201).json({
      msg: "User created in Firebase and MongoDB. Verification email sent.",
      firebaseUID: userRecord.uid,
      verifyLink
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord.emailVerified) {
      return res.status(403).json({ msg: 'Please verify your email.' });
    }

    // Try by Firebase UID
    let mongoUser = await User.findOne({ firebaseUID: userRecord.uid });

    // Fallback to email
    if (!mongoUser) {
      mongoUser = await User.findOne({ email: userRecord.email });

      if (mongoUser) {
        // Update with Firebase UID
        mongoUser.firebaseUID = userRecord.uid;
        mongoUser.lastLogin = new Date();
        await mongoUser.save();
      }
    }

    // Still not found? Create new user
    if (!mongoUser) {
      mongoUser = new User({
        firebaseUID: userRecord.uid,
        name: userRecord.displayName || 'Unnamed',
        email: userRecord.email,
        favorites: [],
        createdAt: new Date(),
        lastLogin: new Date()
      });
      await mongoUser.save();
    } else {
      mongoUser.lastLogin = new Date();
      await mongoUser.save();
    }

    res.json({
      msg: 'Login allowed. Email verified.',
      firebaseUID: userRecord.uid,
      name: userRecord.displayName,
      email: userRecord.email
    });

  } catch (err) {
    console.error('❌ Login failed:', err.message);
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};






// @desc    Get user profile (requires Firebase-authenticated request)
// @route   GET /api/users/me
exports.getProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.userId)
    console.log('📥 GET /users/me hit with Firebase UID:', req.userId);
    const user = await User.findOne({ firebaseUID: req.userId })
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
    // const user = await User.findById(req.userId);
    const user = await User.findOne({ firebaseUID: req.userId });

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
    // const user = await User.findById(req.userId);
    const user = await User.findOne({ firebaseUID: req.userId });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // await User.findByIdAndRemove(req.userId);
    await User.deleteOne({ firebaseUID: req.userId });
    res.json({ msg: 'User account deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// @desc    Get all users
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
