// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { login } from '../api/api'; 

// // export default function LogInScreen({ navigation }) {
// //   const [email, setEmail] = useState('');

// //   const handleLogin = async () => {
// //     try {
// //       const data = await login(email);

// //       await AsyncStorage.setItem('firebaseUID', data.firebaseUID);
// //       await AsyncStorage.setItem('userEmail', data.email);
// //       await AsyncStorage.setItem('userName', data.name);

// //       alert('Login successful!');
// //       navigation.replace('NavBar'); 
// //     } catch (err) {
// //       console.error('Login failed', err);
// //       alert(err?.response?.data?.msg || 'Login failed. Try again.');
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.card}>
// //         <Text style={styles.title}>Hello!</Text>
// //         <Text style={styles.subtitle}>Welcome back to DineLeb</Text>

// //         <View style={styles.inputBox}>
// //           <TextInput
// //             placeholder="Email"
// //             value={email}
// //             onChangeText={setEmail}
// //             style={styles.input}
// //             autoCapitalize="none"
// //             keyboardType="email-address"
// //           />
// //         </View>

// //         <TouchableOpacity style={styles.button} onPress={handleLogin}>
// //           <Text style={styles.buttonText}>Login</Text>
// //         </TouchableOpacity>

// //         <Text style={styles.bottomText}>
// //           Don’t have an account?
// //           <Text onPress={() => navigation.navigate('Register')} style={styles.link}> Register</Text>
// //         </Text>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#6B2C1A',
// //     justifyContent: 'flex-end',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderTopLeftRadius: 40,
// //     borderTopRightRadius: 40,
// //     padding: 24,
// //     paddingTop: 40,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 4,
// //     color: '#333',
// //   },
// //   subtitle: {
// //     color: '#777',
// //     marginBottom: 24,
// //   },
// //   inputBox: {
// //     marginBottom: 12,
// //   },
// //   input: {
// //     backgroundColor: '#F5F5F5',
// //     borderRadius: 12,
// //     padding: 14,
// //     marginBottom: 12,
// //     fontSize: 14,
// //     color: '#333',
// //   },
// //   button: {
// //     backgroundColor: '#6B2C1A',
// //     borderRadius: 14,
// //     paddingVertical: 14,
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   bottomText: {
// //     textAlign: 'center',
// //     marginTop: 20,
// //     color: '#666',
// //   },
// //   link: {
// //     color: '#6B2C1A',
// //     fontWeight: 'bold',
// //   },
// // });

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { login } from '../api/api';

// export default function LogInScreen({ navigation }) {
//   const [email, setEmail] = useState('');

//   const handleLogin = async () => {
//     try {
//       const data = await login(email);

//       await AsyncStorage.setItem('firebaseUID', data.firebaseUID);
//       await AsyncStorage.setItem('userEmail', data.email);
//       await AsyncStorage.setItem('userName', data.name);

//       alert('Login successful!');
//       navigation.replace('NavBar');
//     } catch (err) {
//       console.error('Login failed', err);
//       alert(err?.response?.data?.msg || 'Login failed. Try again.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <Text style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Log in to DineLeb 🍽️</Text>

//         <TextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           style={styles.input}
//           autoCapitalize="none"
//           keyboardType="email-address"
//         />

//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>

//         <Text style={styles.bottomText}>
//           Don’t have an account?
//           <Text onPress={() => navigation.navigate('Register')} style={styles.link}> Register</Text>
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
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase'; 
import { useNavigation } from '@react-navigation/native';

export default function LogInScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        alert('Please verify your email before logging in.');
        return;
      }
  
      // ✅ Save all required user info
      const idToken = await user.getIdToken();
      console.log('🔥 Firebase token:', idToken);
      await AsyncStorage.setItem('token', idToken);
      await AsyncStorage.setItem('userEmail', user.email);
      await AsyncStorage.setItem('firebaseUID', user.uid);
      await AsyncStorage.setItem('userName', user.displayName || 'User'); // 👈 THIS was missing
  
      alert('Login successful!');
      navigation.replace('NavBar'); // your main app screen
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
    backgroundColor: '#14B393',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomText: { textAlign: 'center', marginTop: 20, color: '#666' },
  link: { color: '#14B393', fontWeight: 'bold', marginLeft: 4 },
});
