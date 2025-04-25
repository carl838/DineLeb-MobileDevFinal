// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// // import {Routes} from './src/routes/route';
// import NavBar from './src/components/NavBar';
// import { NavigationContainer } from '@react-navigation/native';

// export default function App() {
//   return (
//     // <View style={styles.container}>
//     //   <Text>Open up App.js to start working on your app!</Text>
//     //   <StatusBar style="auto" />
//     // </View>
//     <NavigationContainer>
//     <View style={{ flex: 1 }}>
//   <NavBar />
// </View>
// </NavigationContainer>

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React from 'react';
import Navigation from './src/components/Navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';

export default function App() {
  
  return(<FavoritesProvider><Navigation /></FavoritesProvider>) ;
}
