// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getApps, getApp } from 'firebase/app';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import Toast from 'react-native-toast-message';
import { CartProvider } from './CartContext';

const firebaseConfig = {
  apiKey: "AIzaSyC3-DiICvYhyCHnsrLzSHLM4w-pG-dYg0M",
  authDomain: "foodorderingapp-c59d7.firebaseapp.com",
  projectId: "foodorderingapp-c59d7",
  storageBucket: "foodorderingapp-c59d7.appspot.com",
  messagingSenderId: "284783797063",
  appId: "1:284783797063:web:5430272b8a9184dc37a262",
  measurementId: "G-HXJVNNCF6P"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FF6B00',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tasty Delights' }} />
          <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Our Menu' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ title: 'Order Confirmed' }} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});


/*
categories collection:
- Document 1: { name: "Pizza", image: "https://..." }
- Document 2: { name: "Burgers", image: "https://..." }
- Document 3: { name: "Sushi", image: "https://..." }

menuItems collection:
- Document 1: { 
    name: "Margherita Pizza", 
    description: "Classic pizza with tomato sauce and mozzarella cheese",
    price: 12.99,
    image: "https://...",
    categoryId: "document-id-of-pizza-category" 
  }

*/