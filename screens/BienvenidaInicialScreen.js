// screens/BienvenidaInicialScreen.js
import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { UserContext } from '../context/UserContext';

export default function BienvenidaInicialScreen({ navigation }) {
    const { saveName } = useContext(UserContext);
    const [apodo, setApodo] = useState('');

    const manejarSiguiente = async () => {
        if (!apodo.trim()) {
            return Alert.alert('Por favor, ingresa tu nombre');
        }
        // Se guarda el nombre en contexto + AsyncStorage
        await saveName(apodo.trim());
        navigation.replace('BienvenidaNombre');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Para comenzar,</Text>
            <Text style={styles.subtitulo}>¿Cómo te gustaría que te llamemos?</Text>

            <TextInput
                style={styles.input}
                placeholder="Escribe tu nombre o apodo aquí"
                value={apodo}
                onChangeText={setApodo}
            />

            <TouchableOpacity
                onPress={manejarSiguiente}
                style={styles.botonPrimario}
            >
                <Text style={styles.botonTextoBlanco}>Siguiente</Text>
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
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    subtitulo: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 30,
        backgroundColor: 'white'
    },
    botonPrimario: {
        backgroundColor: '#1e90ff',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center'
    },
    botonTextoBlanco: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    }
});
