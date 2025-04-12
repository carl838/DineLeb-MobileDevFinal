const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant'); // Add this import

// Create review
exports.createReview = async (req, res) => {
  try {
    const { restaurantId, rating, reviewText } = req.body;
    
    const review = new Review({
      user: {
        userId: req.userId,
        name: req.user.name
      },
      restaurant: {
        restaurantId,
        name: req.body.restaurantName
      },
      rating,
      reviewText
    });

    await review.save();
    
    // Update restaurant's average rating
    await updateRestaurantRating(restaurantId);
    
    res.status(201).json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Helper function
async function updateRestaurantRating(restaurantId) {
  try {
    const result = await Review.aggregate([
      { $match: { 'restaurant.restaurantId': mongoose.Types.ObjectId(restaurantId) } },
      { $group: { 
        _id: null, 
        avgRating: { $avg: '$rating' }, 
        count: { $sum: 1 } 
      }}
    ]);

    if (result.length > 0) {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        averageRating: parseFloat(result[0].avgRating.toFixed(1)),
        reviewCount: result[0].count
      });
    }
  } catch (err) {
    console.error('Error updating rating:', err);
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    
    // Check if the user owns this review
    if (review.user.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized to delete this review' });
    }
    
    await review.findByIdAndRemove(req.params.id);
    
    // Update restaurant's average rating after deletion
    await updateRestaurantRating(review.restaurant.restaurantId);
    
    res.json({ msg: 'Review deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};