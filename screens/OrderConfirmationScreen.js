import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { orderId, total } = route.params;
  const [isAnimating, setIsAnimating] = useState(true);
  const scaleAnim = new Animated.Value(0);
  
  useEffect(() => {
    // Play success haptic feedback
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log("Haptics not available");
    }
    
    // Start animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      setIsAnimating(false);
    });
    
    // Reset navigation if user tries to go back
    navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        navigation.navigate('Home');
      }
    });
  }, []);

  // Function to get a random delivery time between 30-45 minutes
  const getDeliveryTime = () => {
    const min = 30;
    const max = 45;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Hidden Easter Egg - Tap the checkmark 5 times to show a funny message
  const [tapCount, setTapCount] = useState(0);
  
  const handleCheckmarkTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount === 5) {
      // Show the Easter egg message
      alert("🥚 Secret message unlocked! The chef says: 'I put extra love in your food!'");
      setTapCount(0);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.successIcon,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCheckmarkTap}
        >
          <View style={styles.checkmarkCircle}>
            <FontAwesome name="check" size={50} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      <Text style={styles.thanksText}>Thank You!</Text>
      <Text style={styles.successText}>Your order has been placed successfully</Text>
      
      <View style={styles.orderInfoContainer}>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Order ID:</Text>
          <Text style={styles.orderInfoValue}>{orderId}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Total Amount:</Text>
          <Text style={styles.orderInfoValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Estimated Delivery:</Text>
          <Text style={styles.orderInfoValue}>{getDeliveryTime()} minutes</Text>
        </View>
      </View>
      
      <View style={styles.deliveryAnimation}>
        <Image 
          source={require('../assets/delivery-illustration.png')} 
          style={styles.deliveryImage}
        />
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    marginTop: 30,
    marginBottom: 20,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thanksText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  orderInfoContainer: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderInfoLabel: {
    fontSize: 16,
    color: '#666',
  },
  orderInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deliveryAnimation: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  deliveryImage: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
  },
  backButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderConfirmationScreen;