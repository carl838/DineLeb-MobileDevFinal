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
    reservationTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }
  }, { timestamps: true });