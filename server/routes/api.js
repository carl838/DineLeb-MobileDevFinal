const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getRestaurants, 
  getRestaurant, 
  searchRestaurants 
} = require('../controllers/restaurants');
const { 
  register, 
  login, 
  getProfile, 
  toggleFavorite 
} = require('../controllers/users');
const {
  createReview
} = require('../controllers/reviews');
const {
  joinWaitlist,
  recordWaitTime : recordWaitlistTime
} = require('../controllers/waitlist');
const {
  createReservation,
  getUserReservations,
  updateStatus
} = require('../controllers/reservations');
const { 
  recordWaitTime, 
  getWaitTimes,
  getWaitTimeTrends 
} = require('../controllers/waitTimeHistory');

// Wait time analytics routes
router.post('/wait-times', auth, recordWaitTime); // For manual/admin wait time recording
router.get('/wait-times/:restaurantId', getWaitTimes);
router.get('/wait-times/:restaurantId/trends', getWaitTimeTrends);

// User routes
router.post('/users/register', register);
router.post('/users/login', login);
router.get('/users/me', auth, getProfile);
router.put('/users/favorites', auth, toggleFavorite);

// Restaurant routes
router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurant);
router.get('/restaurants/search', searchRestaurants);

// Reservation routes
router.post('/reservations', auth, createReservation);
router.get('/reservations/user', auth, getUserReservations);
router.put('/reservations/:id/status', auth, updateStatus);

// Review routes
router.post('/reviews', auth, createReview);

// Waitlist routes
router.post('/waitlist', auth, joinWaitlist);
router.post('/waitlist/:id/record-time', auth, recordWaitlistTime); // For automatic recording when seated

module.exports = router;