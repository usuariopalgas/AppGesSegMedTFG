// src/screen/DiasEspecificosSemanaScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

export default function DiasEspecificosSemanaScreen({ navigation, route }) {
    const { medicamento } = route.params;
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const [seleccion, setSeleccion] = useState(null);

    const opciones = [
        {
            nombre: "Intervalo",
            descripcion: "Por ejemplo: cada dos días o cada 6 horas",
            onPress: () => navigation.navigate('IntervaloScreen', { medicamento })
        },
        {
            nombre: "Varias veces al día",
            descripcion: "Por ejemplo: 4 o más veces al día",
            onPress: () => navigation.navigate('SeleccionarVecesAlDia', { medicamento })
        },
        {
            nombre: "Días específicos de la semana",
            descripcion: "Por ejemplo: lunes, miércoles y viernes",
            onPress: () => navigation.navigate('FrecuenciaDiasSemana', { medicamento })
        },
        {
            nombre: "Modo cíclico",
            descripcion: "Por ejemplo: 21 días de toma, 7 de pausa",
            onPress: () => navigation.navigate('CiclicoScreen', { medicamento })
        }
    ];

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={estilos.nombreMedicamento}>{medicamento.nombre}</Text>
                <Text style={estilos.titulo}>¿Cuál de estas opciones quieres seleccionar para la toma del medicamento?</Text>
                <View style={{ marginTop: 18 }}>
                    {opciones.map(op => (
                        <View key={op.nombre} style={{ marginBottom: 10 }}>
                            <TouchableOpacity
                                style={[
                                    estilos.botonGrande,
                                    seleccion === op.nombre && { backgroundColor: '#1e90ff' }
                                ]}
                                onPress={() => {
                                    setSeleccion(op.nombre);
                                    op.onPress();
                                }}
                            >
                                <Text style={estilos.textoBotonGrande}>{op.nombre}</Text>
                            </TouchableOpacity>
                            <Text style={estilos.textoDescripcionAyuda}>{op.descripcion}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
