const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
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
    partySize: { type: Number, required: true },
    joinTime: { type: Date, default: Date.now },
    estimatedWaitMinutes: { type: Number },
    status: { 
      type: String, 
      enum: ['waiting', 'notified', 'seated', 'expired'],
      default: 'waiting'
    },
    notifyBySMS: { type: Boolean, default: false },
    expiresAt: { type: Date }
  }, { timestamps: true , collection: 'waitlists'});
  
  module.exports = mongoose.model('Waitlist', waitlistSchema);