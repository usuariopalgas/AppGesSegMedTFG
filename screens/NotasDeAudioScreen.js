// src/screen/NotasDeAudioScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function NotasDeAudioScreen() {
    const [notas, setNotas] = useState([]);
    const [reproduciendoId, setReproduciendoId] = useState(null);
    const [sonido, setSonido] = useState(null);

    useEffect(() => {
        cargarNotas();
        return () => {
            if (sonido) {
                sonido.unloadAsync();
            }
        };
    }, []);

    const cargarNotas = async () => {
        try {
            const data = await AsyncStorage.getItem('notasDeAudio');
            const lista = data ? JSON.parse(data) : [];
            setNotas(lista.reverse()); // últimas primero
            console.log('Notas cargadas:', lista);
        } catch (error) {
            console.error('Error al cargar notas:', error);
        }
    };

    const reproducirNota = async (nota) => {
        try {
            if (sonido) {
                await sonido.unloadAsync();
            }

            setReproduciendoId(nota.id);
            const { sound } = await Audio.Sound.createAsync({ uri: nota.audioURI });
            setSonido(sound);

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setReproduciendoId(null);
                    sound.unloadAsync();
                }
            });

            await sound.playAsync();
        } catch (error) {
            console.error('Error al reproducir nota:', error);
            Alert.alert('Error', 'No se pudo reproducir la nota.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.fecha}>{new Date(item.fecha).toLocaleString()}</Text>
            <Button
                title={reproduciendoId === item.id ? '⏳ Reproduciendo...' : '🔊 Reproducir'}
                onPress={() => reproducirNota(item)}
                disabled={reproduciendoId === item.id}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.encabezado}>🎧 Notas de voz guardadas</Text>
            {notas.length === 0 ? (
                <Text style={styles.vacio}>No hay notas disponibles.</Text>
            ) : (
                <FlatList
                    data={notas}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    encabezado: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    card: {
        backgroundColor: '#f4f4f4',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    fecha: { fontSize: 14, color: '#555', marginBottom: 8 },
    vacio: { textAlign: 'center', fontSize: 16, marginTop: 30, color: '#777' },
});
