const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// Create reservation
exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, reservationTime, partySize, specialRequests } = req.body;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    const reservation = new Reservation({
      user: {
        userId: req.userId,
        name: req.user.name
      },
      restaurant: {
        restaurantId: restaurant._id,
        name: restaurant.name
      },
      reservationTime,
      partySize,
      specialRequests,
      statusHistory: [{
        status: 'pending',
        by: 'user'
      }]
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Update reservation status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    reservation.status = status;
    reservation.statusHistory.push({
      status,
      by: req.user.role // 'user' or 'restaurant'
    });

    if (status === 'cancelled') {
      reservation.cancelledAt = new Date();
    }

    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get user reservations
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      'user.userId': req.userId
    }).sort({ reservationTime: -1 });
    
    res.json(reservations);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }
    
    // Check if the user owns this reservation
    if (reservation.user.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized to delete this reservation' });
    }
    
    // Only allow deletion of pending reservations
    if (reservation.status !== 'pending') {
      return res.status(400).json({ 
        msg: 'Cannot delete a reservation that is already confirmed, completed, or cancelled' 
      });
    }
    
    await Reservation.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Reservation deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ reservationTime: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
