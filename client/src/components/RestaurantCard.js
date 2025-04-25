import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const RestaurantCard = ({ restaurant, onPress, isFavorite, onToggleFavorite }) => {
  const imageUri = restaurant.images?.find(img => img.isPrimary)?.filename 
    || 'https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Restaurant';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
          <AntDesign name="heart" size={20} color={isFavorite ? '#FF3B30' : '#ccc'} />
        </TouchableOpacity>

        {restaurant.averageRating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{restaurant.averageRating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{restaurant.description || 'Delicious food & great service'}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <AntDesign name="clockcircleo" size={12} color="#666" />
            <Text style={styles.detailText}>{restaurant.deliveryTime || '30-45 min'}</Text>
          </View>

          <View style={styles.detailItem}>
            <AntDesign name="enviromento" size={12} color="#666" />
            <Text style={styles.detailText}>{restaurant.distance || '1.2 km'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rating: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
});

export default RestaurantCard;