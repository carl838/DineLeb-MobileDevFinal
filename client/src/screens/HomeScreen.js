
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
    restaurant.name.toLowerCase().startsWith(searchQuery.toLowerCase())
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
          contentContainerStyle={{ paddingTop: 70, paddingHorizontal: 16, paddingBottom: 100 }}
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
