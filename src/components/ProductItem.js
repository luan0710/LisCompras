import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductItem = ({ product, togglePurchased, openEditModal, deleteProduct, updateQuantity }) => {
    return (
        <View style={[
            styles.itemContainer,
            product.purchased && styles.purchasedContainer
        ]}>
            <TouchableOpacity 
                style={styles.productTextContainer} 
                onPress={() => togglePurchased(product.id)}
            >
                <View style={styles.nameContainer}>
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
                <Text style={[
                    styles.productPrice,
                    product.purchased && styles.purchasedText
                ]}>
                    R$ {product.price.toFixed(2)}
                </Text>
            </TouchableOpacity>

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
        marginBottom: 4,
    },
    checkIcon: {
        marginRight: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
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
    orangeButton: {
        backgroundColor: '#f4511e',
    },
    blueButton: {
        backgroundColor: '#2196F3',
    },
    redButton: {
        backgroundColor: '#FF5252',
    },
});

export default ProductItem; 