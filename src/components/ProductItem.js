import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductItem = ({ product, togglePurchased, openEditModal, deleteProduct, updateQuantity }) => {
    return (
        <View style={[
            styles.itemContainer,
            product.purchased && styles.purchasedContainer
        ]}>
            <View style={styles.productTextContainer}>
                <View style={styles.nameContainer}>
                    <View style={styles.nameAndCheckContainer}>
                        {product.purchased && (
                            <MaterialIcons 
                                name="check-circle" 
                                size={20} 
                                color="#4CAF50" 
                                style={styles.checkIcon}
                            />
                        )}
                        <Text 
                            style={[
                                styles.productName,
                                product.purchased && styles.purchasedText
                            ]}
                        >
                            {product.name}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={[
                            styles.cartButton, 
                            product.purchased ? styles.greenButton : styles.grayButton
                        ]}
                        onPress={() => togglePurchased(product.id)}
                    >
                        <MaterialIcons 
                            name={product.purchased ? "shopping-cart" : "add-shopping-cart"} 
                            size={24} 
                            color="white" 
                        />
                    </TouchableOpacity>
                </View>
                <Text style={[
                    styles.productPrice,
                    product.purchased && styles.purchasedText
                ]}>
                    R$ {product.price.toFixed(2)}
                </Text>
            </View>

            <View style={styles.buttonsContainer}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={[styles.circleButton, styles.orangeButton]}
                        onPress={() => updateQuantity(product.id, -1)}
                    >
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={[
                        styles.quantityText,
                        product.purchased && styles.purchasedText
                    ]}>
                        {product.quantity}
                    </Text>
                    <TouchableOpacity 
                        style={[styles.circleButton, styles.orangeButton]}
                        onPress={() => updateQuantity(product.id, 1)}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.circleButton, styles.blueButton]}
                        onPress={() => openEditModal(product)}
                    >
                        <MaterialIcons name="edit" size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.circleButton, styles.redButton]}
                        onPress={() => deleteProduct(product.id)}
                    >
                        <MaterialIcons name="delete" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: 'white',
    },
    purchasedContainer: {
        backgroundColor: '#f5f5f5',
    },
    productTextContainer: {
        marginBottom: 8,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    nameAndCheckContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    checkIcon: {
        marginRight: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    productPrice: {
        fontSize: 14,
        color: '#666',
    },
    purchasedText: {
        color: '#888',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f0f0f0',
        padding: 4,
        borderRadius: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 4,
    },
    circleButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 16,
    },
    quantityText: {
        minWidth: 24,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    grayButton: {
        backgroundColor: '#757575',
    },
    greenButton: {
        backgroundColor: '#4CAF50',
    },
    blueButton: {
        backgroundColor: '#2196F3',
    },
    redButton: {
        backgroundColor: '#FF5252',
    },
    orangeButton: {
        backgroundColor: '#f4511e',
    },
    cartButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
});

export default ProductItem; 