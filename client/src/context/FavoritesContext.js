// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { getUserProfile, toggleFavoriteOnServer } from '../api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// // Create context
// const FavoritesContext = createContext();

// // Provider component
// export const FavoritesProvider = ({ children }) => {
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Load favorites on initial render
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       loadFavorites();
//     }, 500);
  
//     return () => clearTimeout(timeout);
//   }, []);
  
//   const loadFavorites = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token || token.trim() === '') {
//         console.log('No valid token found. Skipping loading favorites.');
//         setFavorites([]);
//         setLoading(false);
//         return;
//       }
  
//       const response = await getUserProfile();
//       const favoritesFromDB = Array.isArray(response.data.favorites)
//         ? response.data.favorites
//         : [];
  
//       setFavorites(favoritesFromDB);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error loading favorites:', error);
//       setLoading(false);
//     }
//   };
  

//   // Function to toggle favorites
//   const toggleFavorite = async (restaurantId) => {
//     try {
//       const updatedFavorites = await toggleFavoriteOnServer(restaurantId);
//       const safeArray = Array.isArray(updatedFavorites) ? updatedFavorites : [];
      
//       setFavorites(safeArray);
//       return safeArray;
//     } catch (error) {
//       console.error('Error toggling favorite:', error);
//       throw error;
//     }
//   };

//   // Check if a restaurant is favorited
//   const isFavorite = (restaurantId) => {
//     return favorites.includes(restaurantId);
//   };

//   return (
//     <FavoritesContext.Provider 
//       value={{ 
//         favorites, 
//         loading, 
//         toggleFavorite, 
//         isFavorite,
//         loadFavorites 
//       }}
//     >
//       {children}
//     </FavoritesContext.Provider>
//   );
// };

// // Custom hook for using favorites context
// export const useFavorites = () => {
//   const context = useContext(FavoritesContext);
//   if (!context) {
//     throw new Error('useFavorites must be used within a FavoritesProvider');
//   }
//   return context;
// };

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile, toggleFavoriteOnServer } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const FavoritesContext = createContext();

// Provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites on initial render
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || token.trim() === '') {
        console.log('No valid token found. Skipping loading favorites.');
        setFavorites([]);
        setLoading(false);
        return;
      }

      const response = await getUserProfile();
      const favoritesFromDB = Array.isArray(response.data.favorites)
        ? response.data.favorites.map(fav => fav._id || fav) // handles populated or non-populated favorites
        : [];

      setFavorites(favoritesFromDB);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (restaurantId) => {
    try {
      const updatedFavorites = await toggleFavoriteOnServer(restaurantId);
      const safeArray = Array.isArray(updatedFavorites) ? updatedFavorites : [];

      setFavorites(safeArray);
      return safeArray;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const isFavorite = (restaurantId) => {
    return favorites.includes(restaurantId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        isFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
