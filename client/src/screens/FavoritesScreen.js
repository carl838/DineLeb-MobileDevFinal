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
// import { toggleFavoriteOnServer } from '../api/api';

// export default function FavoritesScreen({ navigation }) {
//   const [restaurants, setRestaurants] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadFavorites = async () => {
//     try {
//       const storedFavorites = await AsyncStorage.getItem('favorites');
//     //   const parsed = storedFavorites ? JSON.parse(storedFavorites) : [];
//     let parsed = [];

// try {
//   parsed = JSON.parse(storedFavorites);
//   if (!Array.isArray(parsed)) parsed = [];
// } catch (e) {
//   parsed = [];
// }


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
//       const updatedFavorites = await toggleFavoriteOnServer(restaurantId);
  
//       if (Array.isArray(updatedFavorites)) {
//         setFavorites([...updatedFavorites]); // Force re-render
//         await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
//       } else {
//         console.error('Invalid favorites array from server:', updatedFavorites);
//       }
//     } catch (err) {
//       console.error('❌ Failed to toggle favorite:', err);
//     }
//   };
  
  

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Your Favorites ❤️</Text>
//           <Text style={styles.subText}>Saved restaurants you love</Text>
//         </View>

//         {/* Content */}
//         <View style={styles.contentContainer}>
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#007AFF" />
//               <Text style={styles.loadingText}>Loading favorites...</Text>
//             </View>
//           ) : (
//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//             >
//               <View style={styles.restaurantsGrid}>
//                 {restaurants.map(restaurant => (
//                   <RestaurantCard
//                     key={restaurant._id}
//                     restaurant={restaurant}
//                     isFavorite={favorites.includes(restaurant._id)}
//                     onPress={() => navigation.navigate('ReservationScreen', { restaurant })}
//                     onToggleFavorite={() => handleToggleFavorite(restaurant._id)}
//                   />
//                 ))}
//               </View>
//               {restaurants.length === 0 && (
//                 <Text style={styles.noFavorites}>You haven’t added any favorites yet.</Text>
//               )}
//             </ScrollView>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#14B393',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     backgroundColor: '#14B393',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'left',
//   },
//   subText: {
//     fontSize: 14,
//     color: '#E0C9BC',
//     marginTop: 4,
//   },
//   contentContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   scrollContent: {
//     padding: 16,
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

// ✅ Updated FavoritesScreen.js — Now using FavoritesProvider cleanly

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getRestaurants } from '../api/api';
import RestaurantCard from '../components/RestaurantCard';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  const loadRestaurants = async () => {
    try {
      const allRes = await getRestaurants();
      setRestaurants(allRes.data);
    } catch (error) {
      console.error('❌ Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRestaurants();
    }, [])
  );

  const filteredRestaurants = restaurants.filter(r => favorites.includes(r._id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Favorites ❤️</Text>
          <Text style={styles.subText}>Saved restaurants you love</Text>
        </View>

        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading favorites...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredRestaurants}
              keyExtractor={(item) => item._id}
              numColumns={2}
              extraData={favorites}
              contentContainerStyle={styles.scrollContent}
              renderItem={({ item }) => (
                <RestaurantCard
                  restaurant={item}
                  isFavorite={favorites.includes(item._id)}
                  onPress={() => navigation.navigate('ReservationScreen', { restaurant: item })}
                  onToggleFavorite={() => toggleFavorite(item._id)}
                />
              )}
              ListEmptyComponent={() => (
                <Text style={styles.noFavorites}>You haven’t added any favorites yet.</Text>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#14B393' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  contentContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: '#666' },
  noFavorites: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
});
