import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Animated
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { CartContext } from '../CartContext';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);
  const { cart } = useContext(CartContext);
  
  // Calculate total items in cart
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Konami code: up, up, down, down, left, right, left, right
  const konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right'];
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      // In a real app, show error message to user
      setCategories([ ]);
      setIsLoading(false);
    }
  };

  // Easter egg handler function
  const handleDirectionPress = (direction) => {
    if (direction === konamiCode[konamiIndex]) {
      const nextIndex = konamiIndex + 1;
      setKonamiIndex(nextIndex);
      
      if (nextIndex === konamiCode.length) {
        // Konami code completed! Trigger the easter egg
        triggerEasterEgg();
        setKonamiIndex(0);
      }
    } else {
      setKonamiIndex(0);
    }
  };

  const triggerEasterEgg = () => {
    // Easter egg animation: Flash the screen
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.2,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.2,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      // Navigate to a secret screen or show a secret message
      navigation.navigate('Menu', { showEasterEgg: true });
    });
  };
  
  // Navigate to cart screen
  const goToCart = () => {
    navigation.navigate('Cart');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Cart Icon with Badge */}
      <TouchableOpacity 
        style={styles.cartIconContainer}
        onPress={goToCart}
      >
        <FontAwesome name="shopping-cart" size={24} color="#FF6B00" />
        {cartItemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItemCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <ScrollView>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hey foodie</Text>
          <Text style={styles.welcomeText}>welcome to tasty delights!</Text>
          <Text style={styles.subText}>Delicious food delivered to your door</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Food Categories</Text>
        <View style={styles.categoriesContainer}>
          {isLoading ? (
            <Text>Loading categories...</Text>
          ) : (
            categories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Menu', { categoryId: category.id, categoryName: category.name })}
              >
                <Image 
                  source={{ uri: category.image }} 
                  style={styles.categoryImage} 
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Hidden Konami code buttons */}
        <View style={styles.konamiContainer}>
          <View style={styles.konamiRow}>
            <TouchableOpacity 
              style={styles.konamiButton} 
              onPress={() => handleDirectionPress('up')}
            >
              <MaterialIcons name="keyboard-arrow-up" size={24} color="#ddd" />
            </TouchableOpacity>
          </View>
          <View style={styles.konamiRow}>
            <TouchableOpacity 
              style={styles.konamiButton} 
              onPress={() => handleDirectionPress('left')}
            >
              <MaterialIcons name="keyboard-arrow-left" size={24} color="#ddd" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.konamiButton} 
              onPress={() => handleDirectionPress('down')}
            >
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#ddd" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.konamiButton} 
              onPress={() => handleDirectionPress('right')}
            >
              <MaterialIcons name="keyboard-arrow-right" size={24} color="#ddd" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF9F2',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  categoryCard: {
    width: '45%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 10,
    textAlign: 'center',
  },
  konamiContainer: {
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.1, // Nearly invisible
  },
  konamiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  konamiButton: {
    padding: 10,
  },
  // New styles for cart icon and badge
  cartIconContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
});

export default HomeScreen;