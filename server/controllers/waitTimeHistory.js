const WaitTimeHistory = require('../models/WaitTimeHistory');
const Restaurant = require('../models/Restaurant');

// @desc    Record new wait time entry
// @route   POST /api/wait-times
exports.recordWaitTime = async (req, res) => {
  try {
    const { restaurantId, partySize, waitDuration } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    const waitTimeEntry = new WaitTimeHistory({
      restaurant: {
        restaurantId: restaurant._id,
        name: restaurant.name
      },
      partySize,
      waitDuration,
      dayOfWeek: new Date().getDay(), // 0=Sunday
      hourOfDay: new Date().getHours() // 24h format
    });

    await waitTimeEntry.save();
    res.status(201).json(waitTimeEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get average wait times for a restaurant
// @route   GET /api/wait-times/:restaurantId
exports.getWaitTimes = async (req, res) => {
  try {
    const { dayOfWeek, hourOfDay, partySize } = req.query;

    const matchStage = { 
      'restaurant.restaurantId': mongoose.Types.ObjectId(req.params.restaurantId) 
    };

    if (dayOfWeek) matchStage.dayOfWeek = parseInt(dayOfWeek);
    if (hourOfDay) matchStage.hourOfDay = parseInt(hourOfDay);
    if (partySize) matchStage.partySize = parseInt(partySize);

    const results = await WaitTimeHistory.aggregate([
      { $match: matchStage },
      { 
        $group: {
          _id: null,
          avgWait: { $avg: '$waitDuration' },
          minWait: { $min: '$waitDuration' },
          maxWait: { $max: '$waitDuration' },
          sampleSize: { $sum: 1 }
        }
      }
    ]);

    res.json(results[0] || { avgWait: null, minWait: null, maxWait: null, sampleSize: 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get wait time trends
// @route   GET /api/wait-times/:restaurantId/trends
exports.getWaitTimeTrends = async (req, res) => {
  try {
    const trends = await WaitTimeHistory.aggregate([
      { 
        $match: { 
          'restaurant.restaurantId': mongoose.Types.ObjectId(req.params.restaurantId) 
        } 
      },
      {
        $group: {
          _id: {
            hourOfDay: '$hourOfDay',
            dayOfWeek: '$dayOfWeek'
          },
          avgWait: { $avg: '$waitDuration' }
        }
      },
      { $sort: { '_id.dayOfWeek': 1, '_id.hourOfDay': 1 } }
    ]);

    res.json(trends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteWaitTimeRecord = async (req, res) => {
  try {
    const waitTimeRecord = await WaitTimeHistory.findById(req.params.id);
    
    if (!waitTimeRecord) {
      return res.status(404).json({ msg: 'Wait time record not found' });
    }
    
    // Only admin should be able to delete wait time records
    // You might want to check for admin role here
    // if (req.user.role !== 'admin') {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }
    
    await WaitTimeHistory.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Wait time record deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllWaitTimeHistory = async (req, res) => {
  try {
    const history = await WaitTimeHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
