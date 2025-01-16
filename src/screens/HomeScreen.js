import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Modal, TouchableOpacity, Alert, Animated } from 'react-native';
import ProductItem from '../components/ProductItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState('name'); // 'name', 'price', 'status'
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

    useEffect(() => {
        navigation.setParams({
            openAddModal: () => setAddModalVisible(true)
        });
    }, [navigation]);

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

    const validateFields = () => {
        if (!productName.trim()) {
            setErrorMessage('Por favor, preencha o nome do produto');
            return false;
        }
        
        const price = parseFloat(productPrice);
        if (!productPrice.trim() || isNaN(price) || price <= 0) {
            setErrorMessage('Por favor, insira um preço válido');
            return false;
        }
        
        const quantity = parseInt(productQuantity);
        if (!productQuantity.trim() || isNaN(quantity) || quantity <= 0) {
            setErrorMessage('Por favor, insira uma quantidade válida');
            return false;
        }
        
        setErrorMessage('');
        return true;
    };

    const addProduct = () => {
        if (!validateFields()) {
            return;
        }
        
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
        setAddModalVisible(false);
        showToast(`${newProduct.name} adicionado com sucesso!`);
    };

    const totalComprados = products.reduce((total, product) => {
        return total + (product.purchased ? product.price * product.quantity : 0);
    }, 0);

    const totalPendentes = products.reduce((total, product) => {
        return total + (!product.purchased ? product.price * product.quantity : 0);
    }, 0);

    const clearPurchasedProducts = () => {
        Alert.alert(
            'Limpar comprados',
            'Deseja remover todos os produtos já comprados da lista?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Limpar',
                    onPress: () => {
                        const newProducts = products.filter(product => !product.purchased);
                        setProducts(newProducts);
                        showToast('Produtos comprados removidos com sucesso!');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

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

    // Função para filtrar e ordenar produtos
    const getFilteredAndSortedProducts = () => {
        let filtered = products;
        
        // Filtrar por pesquisa
        if (searchQuery) {
            filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Ordenar
        return filtered.sort((a, b) => {
            switch (sortType) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return (b.price * b.quantity) - (a.price * a.quantity);
                case 'status':
                    return (a.purchased === b.purchased) ? 0 : a.purchased ? 1 : -1;
                default:
                    return 0;
            }
        });
    };

    // Componente para o cabeçalho da lista com opções de ordenação
    const ListHeader = () => (
        <View style={styles.listHeader}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>
            <View style={styles.sortButtons}>
                <TouchableOpacity 
                    style={[
                        styles.sortButton,
                        sortType === 'name' && styles.sortButtonActive
                    ]}
                    onPress={() => setSortType('name')}
                >
                    <Text style={[
                        styles.sortButtonText,
                        sortType === 'name' && styles.sortButtonTextActive
                    ]}>Nome</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.sortButton,
                        sortType === 'price' && styles.sortButtonActive
                    ]}
                    onPress={() => setSortType('price')}
                >
                    <Text style={[
                        styles.sortButtonText,
                        sortType === 'price' && styles.sortButtonTextActive
                    ]}>Valor</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.sortButton,
                        sortType === 'status' && styles.sortButtonActive
                    ]}
                    onPress={() => setSortType('status')}
                >
                    <Text style={[
                        styles.sortButtonText,
                        sortType === 'status' && styles.sortButtonTextActive
                    ]}>Status</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const openAddModal = () => {
        setProductName('');
        setProductPrice('');
        setProductQuantity('');
        setAddModalVisible(true);
    };

    const closeAddModal = () => {
        setErrorMessage('');
        setAddModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.totalsContainer}>
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Comprados</Text>
                    <Text style={[styles.totalValue, styles.purchasedValue]}>
                        R$ {totalComprados.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Pendentes</Text>
                    <Text style={[styles.totalValue, styles.pendingValue]}>
                        R$ {totalPendentes.toFixed(2)}
                    </Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#666" />
            <TextInput 
                    style={styles.searchInput}
                    placeholder="Pesquisar produtos..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity 
                        onPress={() => setSearchQuery('')}
                        style={styles.clearSearch}
                    >
                        <MaterialIcons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {products.some(p => p.purchased) && (
                <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearPurchasedProducts}
                >
                    <MaterialIcons name="delete-sweep" size={20} color="white" />
                    <Text style={styles.clearButtonText}>Limpar Comprados</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setAddModalVisible(true)}
            >
                <MaterialIcons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>Adicionar Produto</Text>
            </TouchableOpacity>

            <FlatList
                ListHeaderComponent={ListHeader}
                data={getFilteredAndSortedProducts()}
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={closeAddModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Novo Produto</Text>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={closeAddModal}
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {errorMessage ? (
                            <View style={styles.errorContainer}>
                                <MaterialIcons name="error-outline" size={20} color="#FF5252" />
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        ) : null}

                        <TextInput 
                            style={[
                                styles.modalInput,
                                !productName.trim() && errorMessage && styles.inputError
                            ]} 
                            placeholder="Nome do Produto" 
                            value={productName} 
                            onChangeText={(text) => {
                                setProductName(text);
                                setErrorMessage('');
                            }}
                        />
                        <TextInput 
                            style={[
                                styles.modalInput,
                                (!productPrice.trim() || isNaN(parseFloat(productPrice)) || parseFloat(productPrice) <= 0) && errorMessage && styles.inputError
                            ]} 
                            placeholder="Preço" 
                            value={productPrice} 
                            onChangeText={(text) => {
                                setProductPrice(text);
                                setErrorMessage('');
                            }}
                            keyboardType="numeric"
                        />
                        <TextInput 
                            style={[
                                styles.modalInput,
                                (!productQuantity.trim() || isNaN(parseInt(productQuantity)) || parseInt(productQuantity) <= 0) && errorMessage && styles.inputError
                            ]} 
                            placeholder="Quantidade" 
                            value={productQuantity} 
                            onChangeText={(text) => {
                                setProductQuantity(text);
                                setErrorMessage('');
                            }}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={closeAddModal}
                            >
                                <Text style={styles.cancelButtonText}>CANCELAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={addProduct}
                            >
                                <Text style={styles.saveButtonText}>ADICIONAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {toastVisible && (
                <Animated.View style={[styles.toast, {opacity: fadeAnim}]}>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
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
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 12,
    },
    totalCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    totalLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    purchasedValue: {
        color: '#4CAF50',
    },
    pendingValue: {
        color: '#f4511e',
    },
    clearButton: {
        backgroundColor: '#FF5252',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 8,
        height: 40,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    clearSearch: {
        padding: 2,
    },
    listHeader: {
        marginBottom: 8,
    },
    sortLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    sortButtons: {
        flexDirection: 'row',
        gap: 4,
    },
    sortButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    sortButtonActive: {
        backgroundColor: '#4CAF50',
    },
    sortButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    sortButtonTextActive: {
        color: 'white',
    },
    inputError: {
        borderColor: '#FF5252',
        borderWidth: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        color: '#FF5252',
        marginLeft: 8,
        flex: 1,
        fontSize: 14,
    },
});

export default HomeScreen; 