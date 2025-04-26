// ===============
// FILE: RegisterScreen.js (Final Corrected with Email Verification)
// ===============

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { register } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const limited = cleaned.slice(0, 8);
    let formatted = limited;
    if (limited.length >= 3) {
      formatted = `${limited.slice(0,2)}-${limited.slice(2,5)}`;
    }
    if (limited.length >= 6) {
      formatted = `${limited.slice(0,2)}-${limited.slice(2,5)} ${limited.slice(5,8)}`;
    }
    return formatted;
  };

  const handleRegister = async () => {
    if (!email.includes('@')) {
      alert('Invalid email address.');
      return;
    }
    if (!/^\d{2}-\d{3} \d{3}$/.test(phone)) {
      alert('Phone number must be in format NN-NNN NNN');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      alert("Passwords don't match.");
      return;
    }

    try {
      const data = { name, email, phone, password };
      const response = await register(data);

      // ✅ Log in to Firebase to send verification email
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      await auth.signOut();

      // ✅ Save data if available (safe)
      if (response.data?.firebaseUID) {
        await AsyncStorage.setItem('firebaseUID', response.data.firebaseUID);
      }
      if (response.data?.email) {
        await AsyncStorage.setItem('userEmail', response.data.email);
      }
      if (response.data?.name) {
        await AsyncStorage.setItem('userName', response.data.name);
      }

      if (response.data.verifyLink) {
        Linking.openURL(response.data.verifyLink);
      }

      alert('Registration successful! Please verify your email.');
      navigation.replace('LogIn');
    } catch (err) {
      console.error('Registration failed', err);
      alert(err?.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Welcome to DineLeb 🍽️</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Phone"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={(text) => setPhone(formatPhoneNumber(text))}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?
          <Text style={styles.link} onPress={() => navigation.navigate('LogIn')}> Log in</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 24, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 6, textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#666' },
  input: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#14B393',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomText: { textAlign: 'center', marginTop: 20, color: '#666' },
  link: { color: '#14B393', fontWeight: 'bold', marginLeft: 4 },
});
