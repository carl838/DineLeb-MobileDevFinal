const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  locationUrl: { type: String },
  contact: {
    phone: { type: String },
    social: { type: String },
    website: { type: String }
  },
  description: { type: String },
  cuisines: [{ type: String }],
  priceRange: { type: String },
  peakHours: [{ type: String }],
  hours: [{
    day: { type: Number },
    open: { type: String },
    close: { type: String }
  }],
  tables: [{
    tableNumber: { type: String },
    capacity: { type: Number },
    status: {
      type: String,
      enum: ['available', 'reserved'],
      default: 'available'
    }
  }],
  images: [{
    filename: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true, collection: 'restaurants' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
