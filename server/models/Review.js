const mongoose = require('mongoose'); // Add this line at the top

const reviewSchema = new mongoose.Schema({
  user: {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    name: { type: String, required: true }
  },
  restaurant: {
    restaurantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Restaurant', 
      required: true 
    },
    name: { type: String, required: true }
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  reviewText: { type: String },
  reply: {
    text: { type: String },
    repliedAt: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);