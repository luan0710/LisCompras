import React from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';

const ProductItem = ({ product, togglePurchased, openEditModal, deleteProduct }) => {
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => togglePurchased(product.id)}>
                <Text style={{ textDecorationLine: product.purchased ? 'line-through' : 'none' }}>
                    {product.name} - R$ {product.price.toFixed(2)} x {product.quantity}
                </Text>
            </TouchableOpacity>
            <Button title="Editar" onPress={() => openEditModal(product)} />
            <Button title="Excluir" onPress={() => deleteProduct(product.id)} />
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ProductItem; 