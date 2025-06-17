// src/screen/SeleccionarVecesAlDiaScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

export default function SeleccionarVecesAlDiaScreen({ navigation, route }) {
    const { medicamento } = route.params;
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const opciones = [3, 4, 5, 6, 7, 8];

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={estilos.titulo}>¿Cuántas veces al día?</Text>
                <View style={{ marginTop: 18 }}>
                    {opciones.map(num => (
                        <TouchableOpacity
                            key={num}
                            style={[estilos.botonGrande, { marginBottom: 12 }]}
                            onPress={() =>
                                navigation.navigate('ElegirHorarios', { medicamento, tomas: num })
                            }
                        >
                            <Text style={estilos.textoBotonGrande}>{num} veces al día</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
