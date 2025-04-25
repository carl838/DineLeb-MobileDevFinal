// // src/components/NavBar.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';

// import HomeScreen from '../screens/HomeScreen';
// import ReviewsScreen from '../screens/ReviewsScreen';
// import ReservationsScreen from '../screens/ReservationsScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import FavoritesScreen from '../screens/FavoritesScreen';

// const Tab = createBottomTabNavigator();

// export default function NavBar() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         initialRouteName="Home"
//         screenOptions={({ route }) => ({
//             headerShown: false,
//           tabBarIcon: ({ color, size, focused  }) => {
//             let iconName;
//             let IconSet = Ionicons;
//             if (route.name === 'Home') iconName = 'restaurant-outline';
//             else if (route.name === 'Favorites') {
//                 iconName = focused ? 'heart' : 'hearto';
//                 IconSet = AntDesign; 
//               }
//             else if (route.name === 'Reviews') iconName = 'chatbubble-ellipses-outline';
//             else if (route.name === 'My Reservations') iconName = 'calendar-outline';
//             else if (route.name === 'Profile') iconName = 'person-circle-outline';

//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//           tabBarActiveTintColor: '#007AFF',
//           tabBarInactiveTintColor: 'gray',
//         })}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Favorites" component={FavoritesScreen} />
//         <Tab.Screen name="Reviews" component={ReviewsScreen} />
//         <Tab.Screen name="My Reservations" component={ReservationsScreen} />
//         <Tab.Screen name="Profile" component={ProfileScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

export default function NavBar() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, focused }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let IconComponent = Ionicons;

          if (route.name === 'Home') {
            iconName = 'restaurant-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'hearto';
            IconComponent = AntDesign;
          } else if (route.name === 'Reviews') {
            iconName = 'chatbubble-ellipses-outline';
          } else if (route.name === 'My Reservations') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1A79A0',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} />
      <Tab.Screen name="My Reservations" component={ReservationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
