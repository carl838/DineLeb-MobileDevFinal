const express = require('express');
const router = express.Router();

const { 
  getRestaurants, 
  getRestaurant, 
  searchRestaurants 
} = require('../controllers/restaurants');

const { 
  register, 
  login, 
  getProfile,
  getAllUsers, 
  toggleFavorite,
  deleteUser,
} = require('../controllers/users');

const auth = require('../middleware/auth');

const {
  createReview,
  getAllReviews
} = require('../controllers/reviews');

const {
  joinWaitlist,
  recordWaitTime: recordWaitlistTime,
  getAllWaitlistEntries
} = require('../controllers/waitlist');

const {
  createReservation,
  getUserReservations,
  updateStatus,
  getAllReservations
} = require('../controllers/reservations');

const { 
  recordWaitTime, 
  getWaitTimes,
  getWaitTimeTrends,
  getAllWaitTimeHistory 
} = require('../controllers/waitTimeHistory');

// Wait Time Analytics
router.post('/wait-times', recordWaitTime);
router.get('/wait-times/:restaurantId', getWaitTimes);
router.get('/wait-times/:restaurantId/trends', getWaitTimeTrends);
router.get('/waittimes', getAllWaitTimeHistory); // generic listing


// Users
router.post('/users/register', register);
router.post('/users/login', login);
router.get('/users/me', auth, getProfile);  // ✅ now protected

// router.get('/users/me', getProfile); //for logged in only
router.get('/users', getAllUsers);
router.put('/users/favorites', auth, toggleFavorite);
router.delete('/users/me', auth, deleteUser); //for logged in only


// Restaurants
router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurant);
router.get('/restaurants/search', searchRestaurants);

// Reservations
router.post('/reservations', auth, createReservation);
router.get('/reservations/user', auth, getUserReservations);
router.put('/reservations/:id/status', updateStatus);
router.get('/reservations', getAllReservations);

// Reviews
router.post('/reviews', createReview);
router.get('/reviews', getAllReviews);

// Waitlist
router.post('/waitlist', joinWaitlist);
router.get('/waitlist', getAllWaitlistEntries);
router.post('/waitlist/:id/record-time', recordWaitlistTime);

module.exports = router;
