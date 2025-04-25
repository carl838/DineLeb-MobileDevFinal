// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator,
//   Animated,
//   Dimensions
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { getRestaurants } from '../api/api';
// import RestaurantCard from '../components/RestaurantCard';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';
// import { BlurView } from 'expo-blur';
// import { toggleFavoriteOnServer } from '../api/api';
// import { getUserProfile } from '../api/api';


// export default function HomeScreen({ navigation }) {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [favorites, setFavorites] = useState([]);
//   const [username, setUsername] = useState('User');
  

//   const scrollY = useRef(new Animated.Value(0)).current;
  

//   const welcomeOpacity = scrollY.interpolate({
//     inputRange: [0, 50],
//     outputRange: [1, 0],
//     extrapolate: 'clamp'
//   });
  
//   const welcomeHeight = scrollY.interpolate({
//     inputRange: [0, 50],
//     outputRange: [50, 0],
//     extrapolate: 'clamp'
//   });

//   const blurOpacity = scrollY.interpolate({
//     inputRange: [0, 50],
//     outputRange: [0, 1],
//     extrapolate: 'clamp'
//   });

//   useEffect(() => {
//     getRestaurants()
//       .then(res => {
//         setRestaurants(res.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching restaurants:', error);
//         setLoading(false);
//       });
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//         const loadFavoritesFromServer = async () => {
//             try {
//               const response = await getUserProfile();
//               const favoritesFromDB = Array.isArray(response.data.favorites)
//                 ? response.data.favorites
//                 : [];
          
//               setFavorites(favoritesFromDB);
//               await AsyncStorage.setItem('favorites', JSON.stringify(favoritesFromDB));
//             } catch (err) {
//               console.error('❌ Failed to load favorites from server:', err);
//             }
//           };
          
  
//       loadFavoritesFromServer();
//     }, [])
//   );

//   useFocusEffect(
//     useCallback(() => {
//         const loadUserData = async () => {
//             try {
//               const response = await getUserProfile();
          
//               const favoritesFromDB = Array.isArray(response.data.favorites)
//                 ? response.data.favorites
//                 : [];
//               const userNameFromDB = response.data.name;
          
//               setFavorites(favoritesFromDB);
//               setUsername(userNameFromDB);
          
//               await AsyncStorage.setItem('favorites', JSON.stringify(favoritesFromDB));
//               await AsyncStorage.setItem('userName', userNameFromDB);
//             } catch (err) {
//               console.error('❌ Failed to load user data:', err);
//             }
//           };
          
  
//       loadUserData();
//     }, [])
//   );


  
//   const handleToggleFavorite = async (restaurantId) => {
//     try {
//       const response = await toggleFavoriteOnServer(restaurantId);
  
//       const newFavorites = Array.isArray(response.data) ? response.data : [];
  
//       // Update state with the new list
//       setFavorites([...newFavorites]);
  
//       // Optional: save to local storage
//       await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
//     } catch (err) {
//       console.error('❌ Failed to toggle favorite:', err);
//     }
//   };
  

//   const handleRestaurantPress = (restaurant) => {
//     navigation.navigate('ReservationScreen', { restaurant });
//   };
  

//   const filteredRestaurants = restaurants.filter(
//     restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
      
//       <View style={styles.headerOuter}>
//         <View style={[StyleSheet.absoluteFill, { backgroundColor: '#14B393' }]} />
        

//          <Animated.View style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}>
//           <BlurView intensity={30} tint="default" style={StyleSheet.absoluteFill} />
//         </Animated.View>     
//         <SafeAreaView style={styles.headerSafeArea}>
//           <Animated.View style={[
//             styles.welcomeContainer, 
//             { 
//               opacity: welcomeOpacity,
//               height: welcomeHeight,
//               overflow: 'hidden'
//             }
//           ]}>
//             <Text style={styles.welcomeText}>Hello {username}!</Text>
//             <Text style={styles.subText}>What do you crave?</Text>
//           </Animated.View>
          
//           <View style={styles.searchContainer}>
//             <View style={styles.searchBar}>
//               <Feather name="search" size={18} color="#999" />
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search..."
//                 placeholderTextColor="#999"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//             </View>
//           </View>
//         </SafeAreaView>
//       </View>
      
//       <Animated.ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//       >
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#007AFF" />
//             <Text style={styles.loadingText}>Loading restaurants...</Text>
//           </View>
//         ) : (
//           <>
//             <Text style={styles.sectionTitle}>Restaurants</Text>
//             <View style={styles.restaurantsGrid}>
//               {filteredRestaurants.map(restaurant => (
//                 <RestaurantCard
//                   key={restaurant._id}
//                   restaurant={restaurant}
//                 //   isFavorite={favorites.includes(restaurant._id)}
//                 isFavorite={Array.isArray(favorites) && favorites.includes(restaurant._id)}
//                   onPress={() => handleRestaurantPress(restaurant)}
//                   onToggleFavorite={() => handleToggleFavorite(restaurant._id)}
//                 />
//               ))}
//             </View>
//           </>
//         )}
//       </Animated.ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   headerOuter: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     backgroundColor: '#14B393',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     overflow: 'hidden', 
//   },  
//   headerSafeArea: {
//     width: '100%',
//   },
//   welcomeContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 10,
//     justifyContent: 'center',
//   },
//   welcomeText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   subText: {
//     fontSize: 14,
//     color: '#E0C9BC',
//     marginTop: 4,
//   },
//   searchContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     height: 40,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#333',
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingTop: 120, // Adjust this value based on your header height
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 16,
//   },
//   loadingContainer: {
//     height: Dimensions.get('window').height - 180,
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
// });


// ✅ Updated HomeScreen.js — Now using FavoritesProvider cleanly with loading fix and debugging

// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator,
//   Animated,
//   FlatList
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { getRestaurants } from '../api/api';
// import { useFavorites } from '../context/FavoritesContext';
// import RestaurantCard from '../components/RestaurantCard';
// import { BlurView } from 'expo-blur';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// export default function HomeScreen({ navigation }) {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState('User');

//   const { favorites, toggleFavorite, isFavorite } = useFavorites();

//   const scrollY = useRef(new Animated.Value(0)).current;

//   const welcomeOpacity = scrollY.interpolate({
//     inputRange: [0, 50],
//     outputRange: [1, 0],
//     extrapolate: 'clamp'
//   });

//   const welcomeHeight = scrollY.interpolate({
//     inputRange: [0, 50],
//     outputRange: [50, 0],
//     extrapolate: 'clamp'
//   });

//   const blurOpacity = scrollY.interpolate({
//     inputRange: [0, 50],
//     outputRange: [0, 1],
//     extrapolate: 'clamp'
//   });

//   useEffect(() => {
//     loadRestaurants();
//     loadUserName();
//   }, []);

//   const loadRestaurants = async () => {
//     try {
//       const res = await getRestaurants();
//       console.log('📦 Restaurants from API:', res.data);
//       const restaurantList = Array.isArray(res.data) ? res.data : [];
//       setRestaurants(restaurantList);
//     } catch (error) {
//       console.error('Error fetching restaurants:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUserName = async () => {
//     try {
//       const storedName = await AsyncStorage.getItem('userName');
//       if (storedName) {
//         setUsername(storedName);
//       }
//     } catch (error) {
//       console.error('Failed to load user name:', error);
//     }
//   };
//   const filteredRestaurants = restaurants.filter(
//     restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <View style={styles.headerOuter}>
//         <View style={[StyleSheet.absoluteFill, { backgroundColor: '#14B393' }]} />
//         <Animated.View style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}>  
//           <BlurView intensity={30} tint="default" style={StyleSheet.absoluteFill} />
//         </Animated.View>

//         <SafeAreaView style={styles.headerSafeArea}>
//           <Animated.View style={[styles.welcomeContainer, { opacity: welcomeOpacity, height: welcomeHeight, overflow: 'hidden' }]}>
//             <Text style={styles.welcomeText}>Hello {username}!</Text>
//             <Text style={styles.subText}>What do you crave?</Text>
//           </Animated.View>

//           <View style={styles.searchContainer}>
//             <View style={styles.searchBar}>
//               <Feather name="search" size={18} color="#999" />
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search..."
//                 placeholderTextColor="#999"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//             </View>
//           </View>
//         </SafeAreaView>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.loadingText}>Loading restaurants...</Text>
//         </View>
//       ) : (
//         <Animated.FlatList
//         numColumns={2} 
//         columnWrapperStyle={{ justifyContent: 'space-between' }}
//           style={styles.scrollView}
//         //   contentContainerStyle={styles.scrollContent}
//         contentContainerStyle={{ paddingTop: 70, paddingHorizontal: 16 }}

//           scrollEventThrottle={16}
//           data={filteredRestaurants}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <RestaurantCard
//               restaurant={item}
//               isFavorite={isFavorite(item._id)}
//               onPress={() => navigation.navigate('ReservationScreen', { restaurant: item })}
//               onToggleFavorite={() => toggleFavorite(item._id)}
//             />
//           )}
//           ListEmptyComponent={() => (
//             <Text style={styles.loadingText}>No restaurants found.</Text>
//           )}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: false }
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFFFFF' },
//   headerOuter: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     backgroundColor: '#14B393',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     overflow: 'hidden',
//   },
//   headerSafeArea: { width: '100%' },
//   welcomeContainer: { paddingHorizontal: 16, paddingTop: 10, justifyContent: 'center' },
//   welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
//   subText: { fontSize: 14, color: '#E0C9BC', marginTop: 4 },
//   searchContainer: { paddingHorizontal: 16, paddingVertical: 10 },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     height: 40,
//   },
//   searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
//   scrollView: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 120 },
//   scrollContent: { padding: 16 },
//   loadingText: { marginTop: 20, textAlign: 'center', color: '#999' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getRestaurants, getUserProfile } from '../api/api';
import { useFavorites } from '../context/FavoritesContext';
import RestaurantCard from '../components/RestaurantCard';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('User');

  const { favorites, toggleFavorite, isFavorite, setFavorites } = useFavorites();

  const scrollY = useRef(new Animated.Value(0)).current;

  const welcomeOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const welcomeHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadRestaurants();
    loadUserName();
    loadUserFavorites();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await getRestaurants();
      const restaurantList = Array.isArray(res.data) ? res.data : [];
      setRestaurants(restaurantList);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUsername(storedName);
      }
    } catch (error) {
      console.error('Failed to load user name:', error);
    }
  };

  const loadUserFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token, skipping favorites fetch');
        return;
      }
      const res = await getUserProfile();
      const favoritesFromDB = res.data.favorites || [];
      setFavorites(favoritesFromDB);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesFromDB));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerOuter}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1A79A0' }]} />
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}>
          <BlurView intensity={30} tint="default" style={StyleSheet.absoluteFill} />
        </Animated.View>

        <SafeAreaView style={styles.headerSafeArea}>
          <Animated.View
            style={[
              styles.welcomeContainer,
              { opacity: welcomeOpacity, height: welcomeHeight, overflow: 'hidden' },
            ]}
          >
            <Text style={styles.welcomeText}>Hello {username}!</Text>
            <Text style={styles.subText}>What do you crave?</Text>
          </Animated.View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      ) : (
        <Animated.FlatList
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          style={styles.scrollView}
          contentContainerStyle={{ paddingTop: 70, paddingHorizontal: 16 }}
          scrollEventThrottle={16}
          data={filteredRestaurants}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              isFavorite={isFavorite(item._id)}
              onPress={() => navigation.navigate('ReservationScreen', { restaurant: item })}
              onToggleFavorite={() => toggleFavorite(item._id)}
            />
          )}
          ListEmptyComponent={() => (
            <Text style={styles.loadingText}>No restaurants found.</Text>
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#1A79A0',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerSafeArea: { width: '100%' },
  welcomeContainer: { paddingHorizontal: 16, paddingTop: 10, justifyContent: 'center' },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  subText: { fontSize: 14, color: '#E0C9BC', marginTop: 4 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  scrollView: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 120 },
  scrollContent: { padding: 16 },
  loadingText: { marginTop: 20, textAlign: 'center', color: '#999' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
