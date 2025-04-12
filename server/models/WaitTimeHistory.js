const mongoose = require('mongoose');

const waitTimeHistorySchema = new mongoose.Schema({
    restaurant: {
      restaurantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
      },
      name: { type: String, required: true }
    },
    partySize: { type: Number, required: true },
    waitDuration: { type: Number, required: true }, // in minutes
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0=Sunday
    hourOfDay: { type: Number, min: 0, max: 23 } // 24h format
  }, { timestamps: true });
  
  module.exports = mongoose.model('WaitTimeHistory', waitTimeHistorySchema);