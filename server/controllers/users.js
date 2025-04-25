const admin = require('../firebase');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Register a new user via Firebase and optionally save info in MongoDB
// @route   POST /api/users/register
exports.register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    const verifyLink = await admin.auth().generateEmailVerificationLink(email);

    // OPTIONAL: Store user in MongoDB if you want to use `getAllUsers` etc.
    const mongoUser = new User({
      firebaseUID: userRecord.uid,
      name,
      email,
      phoneNumber,
      password, // Firebase manages password
      createdAt: new Date(),
      lastLogin: new Date()
    });

    await mongoUser.save();

    res.status(201).json({
      msg: "User created in Firebase. Verification email sent.",
      firebaseUID: userRecord.uid,
      verifyLink
      
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};


// exports.login = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const userRecord = await admin.auth().getUserByEmail(email);
//     console.log('🔥 Firebase User:', {
//       uid: userRecord.uid,
//       emailVerified: userRecord.emailVerified,
//       email: userRecord.email,
//     });

//     if (!userRecord.emailVerified) {
//       console.warn(`🚫 Email not verified for ${email}`);
//       return res.status(403).json({ msg: 'Please verify your email.' });
//     }

//     // Optional: log that login was accepted
//     console.log(`✅ Login allowed for: ${email}`);

//     await User.findOneAndUpdate({ email }, { lastLogin: new Date() });

//     res.json({
//       msg: 'Login allowed. Email verified.',
//       firebaseUID: userRecord.uid,
//       name: userRecord.displayName,
//       email: userRecord.email,
//     });

//   } catch (err) {
//     console.error('❌ Login failed:', err.message);
//     res.status(500).json({ msg: 'Login failed', error: err.message });
//   }
// };
exports.login = async (req, res) => {
  const { email } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord.emailVerified) {
      return res.status(403).json({ msg: 'Please verify your email.' });
    }

    // ✅ Try to find user in MongoDB
    let mongoUser = await User.findOne({ firebaseUID: userRecord.uid });

    // ✅ If not found, create it now
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
