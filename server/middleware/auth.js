const admin = require('../firebase');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    req.user = {
      email: decoded.email,
      name: decoded.name || decoded.email
    };
    next();
  } catch (err) {
    console.error('Invalid Firebase token:', err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};
