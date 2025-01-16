import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Modal, TouchableOpacity, Alert, Animated } from 'react-native';
import ProductItem from '../components/ProductItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const fadeAnim = useState(new Animated.Value(0))[0];

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

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setToastVisible(false);
        });
    };

    const addProduct = () => {
        if (!validateFields()) return;
        
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
        showToast(`${newProduct.name} adicionado com sucesso!`);
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
        if (!validateFields()) return;
        
        setProducts(products.map(product => 
            product.id === currentProductId 
                ? { 
                    ...product, 
                    name: productName, 
                    price: parseFloat(productPrice), 
                    quantity: parseInt(productQuantity) 
                } 
                : product
        ));
        setModalVisible(false);
        setProductName('');
        setProductPrice('');
        setProductQuantity('');
        showToast('Produto atualizado com sucesso!');
    };

    const deleteProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            Alert.alert(
                'Confirmar exclusão',
                `Deseja realmente excluir "${product.name}"?`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Excluir',
                        onPress: () => {
                            setProducts(products.filter(product => product.id !== id));
                        },
                        style: 'destructive',
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const updateQuantity = (id, increment) => {
        setProducts(products.map(product => 
            product.id === id 
                ? { ...product, quantity: Math.max(1, product.quantity + increment) }
                : product
        ));
    };

    const validateFields = () => {
        if (!productName.trim()) {
            alert('Por favor, insira o nome do produto');
            return false;
        }
        
        const price = parseFloat(productPrice);
        if (isNaN(price) || price <= 0) {
            alert('Por favor, insira um preço válido');
            return false;
        }
        
        const quantity = parseInt(productQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Por favor, insira uma quantidade válida');
            return false;
        }
        
        return true;
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
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Produto</Text>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TextInput 
                            style={styles.modalInput} 
                            placeholder="Nome do Produto" 
                            value={productName} 
                            onChangeText={setProductName}
                        />
                        <TextInput 
                            style={styles.modalInput} 
                            placeholder="Preço" 
                            value={productPrice} 
                            onChangeText={setProductPrice} 
                            keyboardType="numeric"
                        />
                        <TextInput 
                            style={styles.modalInput} 
                            placeholder="Quantidade" 
                            value={productQuantity} 
                            onChangeText={setProductQuantity} 
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>CANCELAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={editProduct}
                            >
                                <Text style={styles.saveButtonText}>SALVAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
            {toastVisible && (
                <Animated.View 
                    style={[
                        styles.toast,
                        {
                            opacity: fadeAnim,
                            transform: [{
                                translateY: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    modalInput: {
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    toast: {
        position: 'absolute',
        bottom: 70,
        left: 20,
        right: 20,
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 1000,
    },
    toastText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default HomeScreen; 