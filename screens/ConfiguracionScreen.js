// screens/ConfiguracionScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfiguracionScreen() {
    const [vibracionActiva, setVibracionActiva] = useState(true);
    const [sonidoActivo, setSonidoActivo] = useState(true);
    const [tamanioTexto, setTamanioTexto] = useState('medio');

    useEffect(() => {
        const cargarPreferencias = async () => {
            const vibracion = await AsyncStorage.getItem('vibracionActiva');
            const sonido = await AsyncStorage.getItem('sonidoActivo');
            const texto = await AsyncStorage.getItem('tamanioTexto');
            if (vibracion !== null) setVibracionActiva(vibracion === 'true');
            if (sonido !== null) setSonidoActivo(sonido === 'true');
            if (texto !== null) setTamanioTexto(texto);
        };
        cargarPreferencias();
    }, []);

    const guardarPreferencia = async (clave, valor) => {
        await AsyncStorage.setItem(clave, valor.toString());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Configuración</Text>

            <View style={styles.fila}>
                <Text style={styles.etiqueta}>Vibración al marcar:</Text>
                <Switch
                    value={vibracionActiva}
                    onValueChange={(valor) => {
                        setVibracionActiva(valor);
                        guardarPreferencia('vibracionActiva', valor);
                    }}
                />
            </View>

            <View style={styles.fila}>
                <Text style={styles.etiqueta}>Sonido al marcar:</Text>
                <Switch
                    value={sonidoActivo}
                    onValueChange={(valor) => {
                        setSonidoActivo(valor);
                        guardarPreferencia('sonidoActivo', valor);
                    }}
                />
            </View>

            <View style={styles.fila}>
                <Text style={styles.etiqueta}>Tamaño del texto:</Text>
                <Picker
                    selectedValue={tamanioTexto}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => {
                        setTamanioTexto(itemValue);
                        guardarPreferencia('tamanioTexto', itemValue);
                    }}
                >
                    <Picker.Item label="Pequeño" value="pequeno" />
                    <Picker.Item label="Medio" value="medio" />
                    <Picker.Item label="Grande" value="grande" />
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    etiqueta: { fontSize: 18 },
});
