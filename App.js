import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({title: '', price: ''});
  const [editProductId, setEditProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const createProduct = async () => {
    try {
      const response = await axios.post(
        'https://dummyjson.com/products/add',
        newProduct,
      );
      setProducts([...products, response.data]);
      setNewProduct({title: '', price: ''});
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async id => {
    try {
      const response = await axios.put(
        `https://dummyjson.com/products/${id}`,
        newProduct,
      );
      setProducts(
        products.map(product => (product.id === id ? response.data : product)),
      );
      setNewProduct({title: '', price: ''});
      setEditProductId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async id => {
    try {
      await axios.delete(`https://dummyjson.com/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = product => {
    setNewProduct({title: product.title, price: product.price});
    setEditProductId(product.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.productContainer}>
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>Price: ${item.price}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => deleteProduct(item.id)} />
            </View>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Title"
        value={newProduct.title}
        onChangeText={text => setNewProduct({...newProduct, title: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={newProduct.price}
        onChangeText={text => setNewProduct({...newProduct, price: text})}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={
          editProductId ? () => updateProduct(editProductId) : createProduct
        }>
        <Text style={styles.addButtonText}>
          {editProductId ? 'Update Product' : 'Add Product'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#6D6875',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    marginVertical: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    backgroundColor: '#E5989B',
    borderRadius: 30,
  },
  productContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#B5838D',
    borderRadius: 15,
  },
  productTitle: {
    fontSize: 18,
    textTransform: 'uppercase',
  },
  productPrice: {
    fontSize: 16,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  input: {
    borderWidth: 4,
    borderColor: '#FFCDB2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#E5989B',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
