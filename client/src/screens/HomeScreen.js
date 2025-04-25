// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator
// } from 'react-native';
// import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
// import { getRestaurants } from '../api/api';
// import RestaurantCard from '../components/RestaurantCard';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';

// export default function HomeScreen({ navigation }) {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [favorites, setFavorites] = useState([]);
//   const [username, setUsername] = useState('User');

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
//       const loadFavorites = async () => {
//         const stored = await AsyncStorage.getItem('favorites');
//         if (stored) setFavorites(JSON.parse(stored));
//       };
//       loadFavorites();
//     }, [])
//   );

//   const handleToggleFavorite = async (restaurantId) => {
//     const updatedFavorites = favorites.includes(restaurantId)
//       ? favorites.filter(id => id !== restaurantId)
//       : [...favorites, restaurantId];

//     setFavorites(updatedFavorites);
//     await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
//   };

//   const handleRestaurantPress = (restaurant) => {
//     navigation.navigate('ReservationScreen', { restaurant });
//   };

//   const filteredRestaurants = restaurants.filter(
//     restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.container}>
//         {/* Brown Header Area */}
//         <View style={styles.header}>
//           <View style={styles.headerTop}>
//             <View>
//               <Text style={styles.welcomeText}>Hello {username}!</Text>
//               <Text style={styles.subText}>What do you crave?</Text>
//             </View>
//           </View>

//           {/* Search Bar */}
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
//         </View>

//         {/* White Content Area */}
//         <View style={styles.contentContainer}>
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#007AFF" />
//               <Text style={styles.loadingText}>Loading restaurants...</Text>
//             </View>
//           ) : (
//             <ScrollView 
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//             >
//               <Text style={styles.sectionTitle}>Restaurants</Text>
//               <View style={styles.restaurantsGrid}>
//                 {filteredRestaurants.map(restaurant => (
//                   <RestaurantCard
//                     key={restaurant._id}
//                     restaurant={restaurant}
//                     isFavorite={favorites.includes(restaurant._id)}
//                     onPress={() => handleRestaurantPress(restaurant)}
//                     onToggleFavorite={() => handleToggleFavorite(restaurant._id)}
//                   />
//                 ))}
//               </View>
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
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
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
//   headerButtons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     marginLeft: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   searchBar: {
//     flex: 1,
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
//   filterButton: {
//     backgroundColor: '#5A3119',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   contentContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
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
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getRestaurants } from '../api/api';
import RestaurantCard from '../components/RestaurantCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BlurView } from 'expo-blur';
import { toggleFavoriteOnServer } from '../api/api';
import { getUserProfile } from '../api/api';


export default function HomeScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('User');
  

  const scrollY = useRef(new Animated.Value(0)).current;
  

  const welcomeOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const welcomeHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [50, 0],
    extrapolate: 'clamp'
  });

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    getRestaurants()
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadFavoritesFromServer = async () => {
        try {
          const response = await getUserProfile();
          const favoritesFromDB = response.data.favorites;
  
          setFavorites(favoritesFromDB);
          await AsyncStorage.setItem('favorites', JSON.stringify(favoritesFromDB));
        } catch (err) {
          console.error('❌ Failed to load favorites from server:', err);
        }
      };
  
      loadFavoritesFromServer();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const response = await getUserProfile();
  
          const favoritesFromDB = response.data.favorites;
          const userNameFromDB = response.data.name;
  
          setFavorites(favoritesFromDB);
          setUsername(userNameFromDB); // ✅ update the greeting name
  
          await AsyncStorage.setItem('favorites', JSON.stringify(favoritesFromDB));
          await AsyncStorage.setItem('userName', userNameFromDB); // optional cache
        } catch (err) {
          console.error('❌ Failed to load user data:', err);
        }
      };
  
      loadUserData();
    }, [])
  );
  

  const filteredRestaurants = restaurants.filter(
    restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerOuter}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#14B393' }]} />
        

         <Animated.View style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}>
          <BlurView intensity={30} tint="default" style={StyleSheet.absoluteFill} />
        </Animated.View>     
        <SafeAreaView style={styles.headerSafeArea}>
          <Animated.View style={[
            styles.welcomeContainer, 
            { 
              opacity: welcomeOpacity,
              height: welcomeHeight,
              overflow: 'hidden'
            }
          ]}>
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
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading restaurants...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Restaurants</Text>
            <View style={styles.restaurantsGrid}>
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  isFavorite={favorites.includes(restaurant._id)}
                  onPress={() => handleRestaurantPress(restaurant)}
                  onToggleFavorite={() => handleToggleFavorite(restaurant._id)}
                />
              ))}
            </View>
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#14B393',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden', 
  },  
  headerSafeArea: {
    width: '100%',
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 14,
    color: '#E0C9BC',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 120, // Adjust this value based on your header height
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  loadingContainer: {
    height: Dimensions.get('window').height - 180,
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
});

