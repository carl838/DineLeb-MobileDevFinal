const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }
  },
  restaurant: {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true }
  },
  tableId: { type: String },
  partySize: { type: Number, required: true },
  reservationTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    at: { type: Date, default: Date.now },
    by: String
  }],
  specialRequests: { type: String }
}, { timestamps: true, collection: 'reservations' });

module.exports = mongoose.model('Reservation', reservationSchema);
