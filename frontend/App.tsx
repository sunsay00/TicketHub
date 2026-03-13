import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo-vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LotteryProvider } from './src/context/LotteryContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { OrderHistoryProvider } from './src/context/OrderHistoryContext';
import type { RootStackParamList } from './src/navigation/types';

import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import TicketsScreen from './src/screens/TicketsScreen';
import SignUpScreen from './src/screens/SignupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { isLoggedIn } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f0f1a',
          borderTopColor: '#1a1a2e',
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#6c757d',
        tabBarLabelStyle: { fontWeight: '600', fontSize: 11 },
        tabBarAllowFontScaling: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Cart"
        component={OrderHistoryScreen}
        options={{
          tabBarLabel: 'Entry',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
          tabBarItemStyle: isLoggedIn ? undefined : { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          tabBarLabel: 'Tix',
          tabBarIcon: ({ color, size }) => <Ionicons name="ticket-outline" size={size} color={color} />,
          tabBarItemStyle: isLoggedIn ? undefined : { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <OrderHistoryProvider>
        <LotteryProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#fef7f0' },
              }}
            >
              <Stack.Screen name="Main" component={HomeTabs} />
              <Stack.Screen name="EventDetail" component={EventDetailScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </LotteryProvider>
      </OrderHistoryProvider>
    </AuthProvider>
  );
}