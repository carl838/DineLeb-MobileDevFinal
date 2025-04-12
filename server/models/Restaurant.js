const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    cuisines: [{ type: String }],
    tables: [{
      tableNumber: { type: String, required: true },
      capacity: { type: Number, required: true },
      status: { type: String, enum: ['available', 'reserved'], default: 'available' }
    }],
    averageRating: { type: Number, default: 0 }
  }, { timestamps: true });