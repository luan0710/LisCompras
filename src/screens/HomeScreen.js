import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Modal } from 'react-native';
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
        return total + (product.purchased ? 0 : product.price * product.quantity);
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
            <Button title="Adicionar Produto" onPress={addProduct} />
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductItem 
                        product={item} 
                        togglePurchased={togglePurchased} 
                        openEditModal={openEditModal} 
                        deleteProduct={deleteProduct} 
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
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    totalCost: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
});

export default HomeScreen; 