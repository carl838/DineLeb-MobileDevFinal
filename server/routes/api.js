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
  toggleFavorite 
} = require('../controllers/users');

const {
  createReview
} = require('../controllers/reviews');

const {
  joinWaitlist,
  recordWaitTime: recordWaitlistTime
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

// Wait Time Analytics
router.post('/wait-times', recordWaitTime);
router.get('/wait-times/:restaurantId', getWaitTimes);
router.get('/wait-times/:restaurantId/trends', getWaitTimeTrends);

// Users
router.post('/users/register', register);
router.post('/users/login', login);
router.get('/users/me', getProfile); //for logged in only
router.get('/users', getAllUsers);
router.put('/users/favorites', toggleFavorite);

// Restaurants
router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurant);
router.get('/restaurants/search', searchRestaurants);

// Reservations
router.post('/reservations', createReservation);
router.get('/reservations/user', getUserReservations);
router.put('/reservations/:id/status', updateStatus);

// Reviews
router.post('/reviews', createReview);

// Waitlist
router.post('/waitlist', joinWaitlist);
router.post('/waitlist/:id/record-time', recordWaitlistTime);

module.exports = router;
