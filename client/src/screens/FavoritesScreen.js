// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getRestaurants } from '../api/api';
// import RestaurantCard from '../components/RestaurantCard';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';

// export default function FavoritesScreen({ navigation }) {
//   const [restaurants, setRestaurants] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadFavorites = async () => {
//     try {
//       const storedFavorites = await AsyncStorage.getItem('favorites');
//       const parsed = storedFavorites ? JSON.parse(storedFavorites) : [];

//       const allRestaurants = await getRestaurants();
//       const filtered = allRestaurants.data.filter(r => parsed.includes(r._id));

//       setFavorites(parsed);
//       setRestaurants(filtered);
//     } catch (error) {
//       console.error('❌ Error loading favorites:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadFavorites();
//     }, [])
//   );

//   const handleToggleFavorite = async (restaurantId) => {
//     try {
//       const updatedFavorites = favorites.includes(restaurantId)
//         ? favorites.filter(id => id !== restaurantId)
//         : [...favorites, restaurantId];

//       await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
//       setFavorites(updatedFavorites);
//       setRestaurants(prev => prev.filter(r => updatedFavorites.includes(r._id)));
//     } catch (error) {
//       console.error('Error updating favorites:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.container}>
//         <Text style={styles.title}>Your Favorites ❤️</Text>

//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#14B393" />
//             <Text style={styles.loadingText}>Loading favorites...</Text>
//           </View>
//         ) : (
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <View style={styles.restaurantsGrid}>
//               {restaurants.map(restaurant => (
//                 <RestaurantCard
//                   key={restaurant._id}
//                   restaurant={restaurant}
//                   isFavorite={favorites.includes(restaurant._id)}
//                   onPress={() => navigation.navigate('ReservationScreen', { restaurant })}
//                   onToggleFavorite={() => handleToggleFavorite(restaurant._id)}
//                 />
//               ))}
//               {restaurants.length === 0 && (
//                 <Text style={styles.noFavorites}>No favorites yet.</Text>
//               )}
//             </View>
//           </ScrollView>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginVertical: 20,
//     color: '#FFFF',
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#666',
//   },
//   restaurantsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   noFavorites: {
//     textAlign: 'center',
//     color: '#999',
//     marginTop: 40,
//     fontSize: 16,
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRestaurants } from '../api/api';
import RestaurantCard from '../components/RestaurantCard';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { toggleFavoriteOnServer } from '../api/api';

export default function FavoritesScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const parsed = storedFavorites ? JSON.parse(storedFavorites) : [];

      const allRestaurants = await getRestaurants();
      const filtered = allRestaurants.data.filter(r => parsed.includes(r._id));

      setFavorites(parsed);
      setRestaurants(filtered);
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleToggleFavorite = async (restaurantId) => {
    try {
      const updatedFavorites = await toggleFavoriteOnServer(restaurantId);
      setFavorites(updatedFavorites);
      setRestaurants(prev =>
        prev.filter(r => updatedFavorites.includes(r._id))
      );
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Favorites ❤️</Text>
          <Text style={styles.subText}>Saved restaurants you love</Text>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading favorites...</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.restaurantsGrid}>
                {restaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    isFavorite={favorites.includes(restaurant._id)}
                    onPress={() => navigation.navigate('ReservationScreen', { restaurant })}
                    onToggleFavorite={() => handleToggleFavorite(restaurant._id)}
                  />
                ))}
              </View>
              {restaurants.length === 0 && (
                <Text style={styles.noFavorites}>You haven’t added any favorites yet.</Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#14B393',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#14B393',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  subText: {
    fontSize: 14,
    color: '#E0C9BC',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  restaurantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noFavorites: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
});
