import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.107:5000/api';

const authAxios = axios.create({ baseURL: BASE_URL });

authAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📦 AUTH
export const register = (data) => {
  return axios.post(`${BASE_URL}/users/register`, data);
};

export const login = async (email) => {
  const response = await axios.post(`${BASE_URL}/users/login`, { email });
  const token = response.data.token || response.data.idToken;

  if (token) {
    await AsyncStorage.setItem('token', token);
  }

  return response.data;
};

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

export const toggleFavoriteOnServer = async (restaurantId) => {
  const res = await authAxios.put('/users/favorites', { restaurantId });
  console.log('🔥 Updated favorites from server:', res.data);
  return res.data;
};

// 👤 PROFILE
export const getUserProfile = () => authAxios.get('/users/me');