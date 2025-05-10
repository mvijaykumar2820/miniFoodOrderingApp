import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { CartContext } from '../CartContext';
console.log("HomeScreen Loaded");


const MenuScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, showEasterEgg } = route.params || {};
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    fetchMenuItems();
  
    // Easter egg alert
    if (showEasterEgg) {
      setTimeout(() => {
        Toast.show({
          type: 'info',
          text1: 'Easter Egg!',
          text2: 'You found a hidden feature! 🎉',
        });
      }, 500);
    }
  
    // Set the navigation title dynamically
    navigation.setOptions({ title: categoryName || 'Our Menu' });
  }, [categoryName]);
  const fetchMenuItems = async () => {
    try {
      let menuItemsQuery;
      
      if (categoryId) {
        menuItemsQuery = query(
          collection(db, 'menuItems'), 
          where('categoryId', '==', categoryId)
        );
      } else {
        menuItemsQuery = collection(db, 'menuItems');
      }
      
      const menuItemsSnapshot = await getDocs(menuItemsQuery);
      const menuItemsList = menuItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMenuItems(menuItemsList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
      // Demo data for development
      setMenuItems([ ]);
      setIsLoading(false);
    }
  };

  const addToCart = (item) => {
    // Check if item already in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCart(
        cart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        )
      );
    } else {
      // Add to cart with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: item.name,
      visibilityTime: 2000,
    });
  };

  const decreaseQuantity = (item) => {
    // Find the item in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      if (existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        setCart(
          cart.map(cartItem => 
            cartItem.id === item.id 
              ? { ...cartItem, quantity: cartItem.quantity - 1 } 
              : cartItem
          )
        );
      } else {
        // Remove item if quantity is 1
        setCart(cart.filter(cartItem => cartItem.id !== item.id));
        Toast.show({
          type: 'info',
          text1: 'Removed from cart',
          text2: item.name,
          visibilityTime: 2000,
        });
      }
    }
  };

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const viewCart = () => {
    navigation.navigate('Cart');
  };

  const renderMenuItem = ({ item }) => {
    const quantity = getItemQuantity(item.id);
    
    return (
      <View style={styles.menuItem}>
        <Image source={{ uri: item.image }} style={styles.menuImage} />
        <View style={styles.menuInfo}>
          <Text style={styles.menuName}>{item.name}</Text>
          <Text style={styles.menuDescription} numberOfLines={2}>{item.description}</Text>
          <View style={styles.priceActionContainer}>
            <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
            
            {quantity > 0 ? (
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
      ) : (
        <>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
          
          {cart.length > 0 && (
            <TouchableOpacity 
              style={styles.viewCartButton}
              onPress={viewCart}
            >
              <Text style={styles.viewCartText}>
                View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </Text>
              <FontAwesome name="shopping-cart" size={22} color="#FFF" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80, // Space for cart button
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  menuInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  priceActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  addButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FF6B00',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  quantityButton: {
    backgroundColor: '#FF6B00',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    width: 30,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewCartButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});

export default MenuScreen;