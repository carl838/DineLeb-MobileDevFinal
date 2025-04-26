import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase'; 
import { useNavigation } from '@react-navigation/native';
import { login } from '../api/api';

export default function LogInScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.includes('@')) {
      alert('Invalid email. Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert('Please verify your email before logging in.');
        return;
      }

      const idToken = await user.getIdToken();
      console.log('🔥 Firebase token:', idToken);

      await AsyncStorage.setItem('token', idToken);
      await AsyncStorage.setItem('userEmail', user.email);
      await AsyncStorage.setItem('firebaseUID', user.uid);
      await AsyncStorage.setItem('userName', user.displayName || 'User');

      await login(user.email); // inform backend

      // 🧠 Only show success message if all above OK
      alert('Login successful!');
      navigation.replace('NavBar');
    } catch (error) {
      console.error('Login error:', error.message);
      alert('Login failed. Please check your email and password.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to DineLeb 🍽️</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Don’t have an account?
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}> Register</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  card: { padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 16, marginBottom: 20, color: '#777' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#1A79A0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomText: { textAlign: 'center', marginTop: 20, color: '#666' },
  link: { color: '#1A79A0', fontWeight: 'bold', marginLeft: 4 },
});
