import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../api/api';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }

        const res = await getUserProfile();
        setUser(res.data);
      } catch (err) {
        console.log('User not logged in');
        setUser(null);
      }
    };

    if (isFocused) loadUser();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <View>
          <Text style={styles.welcome}>Welcome, {user.name}!</Text>
          {/* Additional profile UI here */}
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Welcome to DineLeb</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LogIn')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.outlineButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    welcome: {
      fontSize: 18,
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#6B2C1A',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    outlineButton: {
      borderWidth: 1,
      borderColor: '#6B2C1A',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    outlineButtonText: {
      color: '#6B2C1A',
      fontWeight: 'bold',
    }
  });
  
