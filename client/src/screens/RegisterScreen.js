// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { register } from '../api/api';
// import { Linking } from 'react-native'; // for opening verification link

// export default function RegisterScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');

//   const handleRegister = async () => {
//     if (password !== confirm) {
//       alert("Passwords don't match");
//       return;
//     }

//     try {
//       const data = { name, email, phone, password };
//       const response = await register(data);

//       // Store user info
//       await AsyncStorage.setItem('firebaseUID', response.data.firebaseUID);
//       await AsyncStorage.setItem('userEmail', response.data.email);
//       await AsyncStorage.setItem('userName', response.data.name);

//       // Open verification link
//       if (response.data.verifyLink) {
//         Linking.openURL(response.data.verifyLink);
//       }

//       alert('Registration successful! Please verify your email.');
//       navigation.replace('LogIn');
//     } catch (err) {
//       console.error('Registration failed', err);
//       alert(err?.response?.data?.msg || 'Registration failed.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>Welcome to DineLeb 🍽️</Text>

//         <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
//         <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
//         <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
//         <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
//         <TextInput style={styles.input} placeholder="Re-enter Password" value={confirm} onChangeText={setConfirm} secureTextEntry />

//         <TouchableOpacity style={styles.button} onPress={handleRegister}>
//           <Text style={styles.buttonText}>Sign Up</Text>
//         </TouchableOpacity>

//         <Text style={styles.bottomText}>
//           Already have an account?
//           <Text onPress={() => navigation.navigate('LogIn')} style={styles.link}> Log in</Text>
//         </Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FAFAFA',
//   },
//   scroll: {
//     padding: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 60,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 6,
//     textAlign: 'center',
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#666',
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 16,
//     fontSize: 14,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#14B393',
//     borderRadius: 14,
//     paddingVertical: 14,
//     paddingHorizontal: 32,
//     alignItems: 'center',
//     marginTop: 10,
//     width: '100%',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   bottomText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#666',
//   },
//   link: {
//     color: '#14B393',
//     fontWeight: 'bold',
//     marginLeft: 4,
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords don't match");
      return;
    }

    try {
      // ✅ Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Set display name in Firebase profile
      await updateProfile(user, { displayName: name });

      // ✅ Send verification email
      await sendEmailVerification(user);

      // ✅ Save info locally (optional)
      await AsyncStorage.setItem('firebaseUID', user.uid);
      await AsyncStorage.setItem('userEmail', user.email);
      await AsyncStorage.setItem('userName', name);

      alert('Registration successful! Please verify your email.');
      navigation.replace('LogIn');
    } catch (err) {
      console.error('Registration failed:', err.message);
      alert(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Welcome to DineLeb 🍽️</Text>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Re-enter Password" value={confirm} onChangeText={setConfirm} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?
          <Text onPress={() => navigation.navigate('LogIn')} style={styles.link}> Log in</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
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
  link: { color: '#14B393', fontWeight: 'bold' },
});

