// screens/BienvenidaPreferenciasScreen.js
import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

const opcionesDisponibles = [
    'Grabar todos mis medicamentos',
    'Recibir avisos de las tomas',
    'Consultar dudas sobre síntomas',
    'Guardar notas de voz para entender las tomas',
    'Grabar la medicación para un ser querido'
];

export default function BienvenidaPreferenciasScreen() {
    const [seleccionadas, setSeleccionadas] = useState([]);
    const { completeWelcome } = useContext(UserContext);

    const toggleSeleccion = opcion => {
        setSeleccionadas(prev =>
            prev.includes(opcion)
                ? prev.filter(o => o !== opcion)
                : [...prev, opcion]
        );
    };

    const manejarContinuar = async () => {
        try {
            await AsyncStorage.setItem(
                'preferencias',
                JSON.stringify(seleccionadas)
            );
            await completeWelcome();
        } catch (error) {
            console.error('Error al guardar preferencias:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>¿Qué te gustaría gestionar?</Text>

            {opcionesDisponibles.map(opcion => (
                <TouchableOpacity
                    key={opcion}
                    onPress={() => toggleSeleccion(opcion)}
                    style={styles.opcion}
                >
                    <Ionicons
                        name={
                            seleccionadas.includes(opcion)
                                ? 'checkbox-outline'
                                : 'square-outline'
                        }
                        size={24}
                        color="#1e90ff"
                        style={{ marginRight: 10 }}
                    />
                    <Text style={styles.opcionTexto}>{opcion}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                style={[styles.boton, !seleccionadas.length && styles.botonDisabled]}
                onPress={manejarContinuar}
                disabled={!seleccionadas.length}
            >
                <Text style={styles.botonTexto}>Vamos</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: '#f9f9f9',
        flexGrow: 1,
        justifyContent: 'center'
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },
    opcion: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    opcionTexto: {
        fontSize: 16,
        flex: 1
    },
    boton: {
        backgroundColor: '#1e90ff',
        padding: 16,
        borderRadius: 10,
        marginTop: 30
    },
    botonDisabled: {
        backgroundColor: '#aaa'
    },
    botonTexto: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center'
    }
});
