const Waitlist = require('../models/Waitlist');
const WaitTimeHistory = require('../models/WaitTimeHistory');

// Join waitlist
exports.joinWaitlist = async (req, res) => {
  try {
    const { restaurantId, partySize, notifyBySMS } = req.body;
    
    const waitlistEntry = new Waitlist({
      user: {
        userId: req.userId,
        name: req.user.name
      },
      restaurant: {
        restaurantId,
        name: req.body.restaurantName // Frontend should send this
      },
      partySize,
      notifyBySMS,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
    });

    await waitlistEntry.save();
    res.status(201).json(waitlistEntry);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Record wait time when seated
exports.recordWaitTime = async (req, res) => {
  try {
    const waitlistEntry = await Waitlist.findById(req.params.id);
    
    const waitDuration = Math.round(
      (new Date() - waitlistEntry.joinTime) / (1000 * 60)
    );

    const waitTimeRecord = new WaitTimeHistory({
      restaurant: waitlistEntry.restaurant,
      partySize: waitlistEntry.partySize,
      waitDuration,
      dayOfWeek: new Date().getDay(),
      hourOfDay: new Date().getHours()
    });

    await waitTimeRecord.save();
    res.json(waitTimeRecord);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.leaveWaitlist = async (req, res) => {
  try {
    const waitlistEntry = await Waitlist.findById(req.params.id);
    
    if (!waitlistEntry) {
      return res.status(404).json({ msg: 'Waitlist entry not found' });
    }
    
    // Check if the user owns this waitlist entry
    if (waitlistEntry.user.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized to remove this waitlist entry' });
    }
    
    await Waitlist.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Removed from waitlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllWaitlistEntries = async (req, res) => {
  try {
    const waitlist = await Waitlist.find().sort({ createdAt: -1 });
    res.json(waitlist);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
