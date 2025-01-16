import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import ProductItem from '../components/ProductItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            const storedProducts = await AsyncStorage.getItem('products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }
        };
        loadProducts();
    }, []);

    useEffect(() => {
        const saveProducts = async () => {
            await AsyncStorage.setItem('products', JSON.stringify(products));
        };
        saveProducts();
    }, [products]);

    const addProduct = () => {
        const newProduct = {
            id: Math.random().toString(),
            name: productName,
            price: parseFloat(productPrice),
            quantity: parseInt(productQuantity),
            purchased: false,
        };
        setProducts([...products, newProduct]);
        setProductName('');
        setProductPrice('');
        setProductQuantity('');
    };

    const totalCost = products.reduce((total, product) => {
        return total + (product.purchased ? product.price * product.quantity : 0);
    }, 0);

    const togglePurchased = (id) => {
        setProducts(products.map(product => 
            product.id === id ? { ...product, purchased: !product.purchased } : product
        ));
    };

    const openEditModal = (product) => {
        setCurrentProductId(product.id);
        setProductName(product.name);
        setProductPrice(product.price.toString());
        setProductQuantity(product.quantity.toString());
        setModalVisible(true);
    };

    const editProduct = () => {
        setProducts(products.map(product => 
            product.id === currentProductId ? { ...product, name: productName, price: parseFloat(productPrice), quantity: parseInt(productQuantity) } : product
        ));
        setModalVisible(false);
        setProductName('');
        setProductPrice('');
        setProductQuantity('');
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const updateQuantity = (id, increment) => {
        setProducts(products.map(product => 
            product.id === id 
                ? { ...product, quantity: Math.max(1, product.quantity + increment) }
                : product
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.totalCost}>Total da Compra: R$ {totalCost.toFixed(2)}</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Nome do Produto" 
                value={productName} 
                onChangeText={setProductName} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Preço" 
                value={productPrice} 
                onChangeText={setProductPrice} 
                keyboardType="numeric" 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Quantidade" 
                value={productQuantity} 
                onChangeText={setProductQuantity} 
                keyboardType="numeric" 
            />
            <TouchableOpacity style={styles.addButton} onPress={addProduct}>
                <Text style={styles.addButtonText}>ADICIONAR PRODUTO</Text>
            </TouchableOpacity>
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductItem 
                        product={item} 
                        togglePurchased={togglePurchased} 
                        openEditModal={openEditModal} 
                        deleteProduct={deleteProduct}
                        updateQuantity={updateQuantity}
                    />
                )}
                keyExtractor={item => item.id}
            />
            <Modal
                animationType="slide"
                transparent={false}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nome do Produto" 
                        value={productName} 
                        onChangeText={setProductName} 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Preço" 
                        value={productPrice} 
                        onChangeText={setProductPrice} 
                        keyboardType="numeric" 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Quantidade" 
                        value={productQuantity} 
                        onChangeText={setProductQuantity} 
                        keyboardType="numeric" 
                    />
                    <Button title="Salvar" onPress={editProduct} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    totalCost: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 20,
    },
    addButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
    },
});

export default HomeScreen; 