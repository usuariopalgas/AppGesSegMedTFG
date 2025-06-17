// src/screen/SeleccionarFrecuenciaScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { guardarFrecuenciaYProgramarNotificacion } from '../services/notificaciones';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

const opciones = [
    "Una vez al día",
    "Dos veces al día",
    "Tres veces al día",
    "Cuando sea necesario (sin recordatorio)",
    "Necesito más opciones..."
];

export default function SeleccionarFrecuenciaScreen({ navigation, route }) {
    const { medicamento } = route.params;
    const [seleccion, setSeleccion] = useState(null);

    // Estilos globales
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const elegirOpcion = (opcion) => {
        setSeleccion(opcion);

        if (opcion === "Necesito más opciones...") {
            navigation.navigate('DiasEspecificosSemana', { medicamento });
            return;
        }
        if (opcion === "Una vez al día") {
            navigation.navigate('ElegirHorarios', { medicamento, tomas: 1 });
            return;
        }
        if (opcion === "Dos veces al día") {
            navigation.navigate('ElegirHorarios', { medicamento, tomas: 2 });
            return;
        }
        if (opcion === "Tres veces al día") {
            navigation.navigate('ElegirHorarios', { medicamento, tomas: 3 });
            return;
        }

        // Opción "cuando sea necesario"
        guardarFrecuenciaYProgramarNotificacion(opcion, medicamento, navigation);
    };

    return (
        <View style={estilos.container}>
            <Text style={estilos.nombreMedicamento}>{medicamento.nombre}</Text>
            <Text style={estilos.titulo}>
                ¿Con qué frecuencia toma este medicamento?
            </Text>
            {opciones.map((op, idx) => (
                <TouchableOpacity
                    key={op}
                    style={{
                        backgroundColor: seleccion === op ? "#eaf4ff" : "#fff",
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 18,
                        borderWidth: 1,
                        borderColor: seleccion === op ? "#1e90ff" : "#eee",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    onPress={() => elegirOpcion(op)}
                >
                    <Text style={{ fontSize: estilos.texto.fontSize + 2 }}>{op}</Text>
                    <View style={{
                        width: 26, height: 26, borderRadius: 13,
                        borderWidth: 2, borderColor: "#bbb",
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: seleccion === op ? "#1e90ff" : "#fff"
                    }}>
                        {seleccion === op && <View style={{
                            width: 12, height: 12, borderRadius: 6,
                            backgroundColor: "#fff"
                        }} />}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}
