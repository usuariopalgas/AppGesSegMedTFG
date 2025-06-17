// screens/BienvenidaNombreScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';

export default function BienvenidaNombreScreen({ navigation }) {
    const { name } = useContext(UserContext);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                {`Encantado de conocerte, ${name}!`}
            </Text>
            <TouchableOpacity
                style={styles.boton}
                onPress={() => navigation.replace('BienvenidaPreferencias')}
            >
                <Text style={styles.botonTexto}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#f9f9f9'
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    boton: {
        backgroundColor: '#1e90ff',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center'
    },
    botonTexto: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center'
    }
});
