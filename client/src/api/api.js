import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.33:5000/api';

// Axios instance with interceptor for auth token
const authAxios = axios.create({ baseURL: BASE_URL });

authAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📦 AUTH
// export const login = async (email) => {
//   const response = await axios.post(`${BASE_URL}/users/login`, { email });
//   return response.data;
// };
// export const login = async (email) => {
//     const response = await axios.post(`${BASE_URL}/users/login`, { email });
//     console.log('Login response:', response.data);

  
//     // ✅ Save token immediately
//     const token = response.data.token || response.data.idToken; // check your backend's key
//     if (token) {
//       await AsyncStorage.setItem('token', token);
//     }
  
//     return response.data;
//   };
  
//REGISTER
// export const register = (data) => {
//     return axios.post(`${BASE_URL}/users/register`, data);
//   };
  

// 🍽️ RESTAURANTS
export const getRestaurants = () => authAxios.get('/restaurants');

// 📅 RESERVATIONS
export const createReservation = (data) => authAxios.post('/reservations', data);
export const getUserReservations = () => authAxios.get('/reservations/user');

// 🕒 WAITLIST
export const joinWaitlist = (data) => authAxios.post('/waitlist', data);
export const getWaitTime = (id) => authAxios.get(`/wait-times/${id}`);

// ⭐ REVIEWS & FAVORITES
export const createReview = (data) => authAxios.post('/reviews', data);
// export const toggleFavoriteOnServer = (restaurantId) =>
//   authAxios.put('/users/favorites', { restaurantId });

export const toggleFavoriteOnServer = async (restaurantId) => {
    const res = await authAxios.put('/users/favorites', { restaurantId });
    console.log('🔥 Updated favorites from server:', res.data);
    return res.data;
  };
  

// 👤 PROFILE
export const getUserProfile = () => authAxios.get('/users/me');
