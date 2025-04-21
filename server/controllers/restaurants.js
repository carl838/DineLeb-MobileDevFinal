const Restaurant = require('../models/Restaurant');


// Get all restaurants
exports.getRestaurants = async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      console.log('Found restaurants:', restaurants.length); // ✅ Debug output
      res.json(restaurants);
    } catch (err) {
      res.status(500).send('Server error');
    }
  };

  // Get single restaurant
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Search restaurants
exports.searchRestaurants = async (req, res) => {
  const { query } = req.query;
  
  try {
    const restaurants = await Restaurant.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'cuisines': { $regex: query, $options: 'i' } }
      ]
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// restaurants.js - Add create method


// @desc    Create a new restaurant
// @route   POST /api/restaurants
exports.createRestaurant = async (req, res) => {
  try {
    const { 
      name, 
      address, 
      cuisines, 
      tables 
    } = req.body;

    // Check if restaurant already exists with same name and address
    const existingRestaurant = await Restaurant.findOne({ 
      name: name,
      address: address 
    });
    
    if (existingRestaurant) {
      return res.status(400).json({ msg: 'Restaurant with this name and address already exists' });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
      name,
      address,
      cuisines: cuisines || [],
      tables: tables || [],
      // If you have restaurant owner authentication:
      // owner: req.userId
    });

    // Save to database
    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    // Only restaurant owners or admins should be able to delete restaurants
    // You might want to check for ownership or admin role here
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await Restaurant.findByIdAndRemove(req.params.id);
    
    // You might want to cascade delete related entities like reviews, reservations, etc.
    // This is just an example of cascading deletion for reviews
    await Review.deleteMany({ 'restaurant.restaurantId': req.params.id });
    
    res.json({ msg: 'Restaurant deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};