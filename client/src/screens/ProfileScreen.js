// ===============
// FILE: ProfileScreen.js (Corrected as Requested)
// ===============

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../api/api';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from '../components/SettingsModal'; // ✅ Import SettingsModal

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false); // ✅ New state
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    navigation.replace('LogIn'); // ✅ Fix: Use correct screen name 'LogIn'
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.subText}>Manage your account</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#1A79A0" />
        </View>

        {user ? (
          <View>
            <Text style={styles.title}>Welcome, {user.name}!</Text>

            <View style={styles.infoBox}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>

              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{user.phoneNumber || 'Not provided'}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton} onPress={() => setShowAbout(true)}>
              <Text style={styles.outlineButtonText}>About Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton} onPress={() => setSettingsVisible(true)}>
              <Text style={styles.outlineButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Welcome to DineLeb</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LogIn')}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.outlineButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {showAbout && (
          <View style={styles.aboutBox}>
            <Text style={styles.aboutTitle}>About DineLeb</Text>
            <Text style={styles.aboutText}>
              DineLeb is your go-to app for discovering and reserving tables at Lebanon's finest restaurants. We aim to make dining effortless and enjoyable.
            </Text>
            <Text style={styles.aboutSubtitle}>Founders:</Text>
            <Text style={styles.aboutText}>- Marilyn Abou Tayeh</Text>
            <Text style={styles.aboutText}>- Carl Bassous</Text>
            <Text style={styles.aboutText}>- Sophia Freiji</Text>

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowAbout(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1A79A0' },

  headerWrapper: {
    backgroundColor: '#1A79A0',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1A79A0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'left' },
  subText: { fontSize: 14, color: '#E0C9BC', marginTop: 4 },

  scrollContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    flexGrow: 1,
    marginTop: 10,
  },

  avatarContainer: { alignItems: 'center', marginTop: -30, marginBottom: 20 },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  infoBox: { marginBottom: 20 },
  label: { color: '#888', fontSize: 14, marginTop: 8 },
  value: { fontSize: 16, color: '#333' },

  button: {
    backgroundColor: '#1A79A0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  outlineButton: {
    borderWidth: 1,
    borderColor: '#1A79A0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  outlineButtonText: { color: '#1A79A0', fontWeight: 'bold' },

  aboutBox: { marginTop: 30, padding: 20, backgroundColor: '#f9f9f9', borderRadius: 12 },
  aboutTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  aboutSubtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#1A79A0' },
  aboutText: { fontSize: 14, color: '#555', marginTop: 4 },
  closeButton: { marginTop: 20, alignSelf: 'center' },
  closeButtonText: { color: '#1A79A0', fontWeight: 'bold' },
});
