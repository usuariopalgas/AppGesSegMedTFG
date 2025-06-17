// src/screen/FrecuenciaDiasSemanaScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { guardarFrecuenciaYProgramarNotificacion } from '../services/notificaciones';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';
import { updateMedicamento, getMedicamentos } from '../services/storage';
import { programarNotificacionesMedicamento } from '../services/notificaciones';

const diasSemana = [
    { nombre: 'Lunes', key: 1 },
    { nombre: 'Martes', key: 2 },
    { nombre: 'Miércoles', key: 3 },
    { nombre: 'Jueves', key: 4 },
    { nombre: 'Viernes', key: 5 },
    { nombre: 'Sábado', key: 6 },
    { nombre: 'Domingo', key: 0 }
];

export default function FrecuenciaDiasSemanaScreen({ navigation, route }) {
    const { medicamento } = route.params;

    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const [hora, setHora] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [dias, setDias] = useState([1, 2, 3, 4, 5, 6, 0]); // Por defecto todos los días
    const [loading, setLoading] = useState(false);

    const toggleDia = (key) => {
        setDias(dias.includes(key)
            ? dias.filter(d => d !== key)
            : [...dias, key]
        );
    };

    const guardar = async () => {
        setLoading(true);
        try {
            // Crea una descripción de frecuencia
            const descripcion = `Personalizada: ${dias
                .map(dk => diasSemana.find(d => d.key === dk).nombre)
                .join(', ')} a las ${hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            // Genera tomas para 14 días
            const N_DIAS = 14;
            let tomasArr = [];
            for (let d = 0; d < N_DIAS; d++) {
                const fechaBase = new Date();
                fechaBase.setDate(fechaBase.getDate() + d);
                const fechaISO = fechaBase.toISOString().split('T')[0];
                // Solo añade la toma si el día de la semana está seleccionado
                if (dias.includes(fechaBase.getDay())) {
                    tomasArr.push({
                        fecha: fechaISO,
                        hora: hora.toTimeString().slice(0, 5),
                        estado: 'pendiente'
                    });
                }
            }

            // 1. Guarda la frecuencia y tomas en el medicamento
            await updateMedicamento(medicamento.id, {
                frecuencia: descripcion,
                dias,
                hora,
                tomas: tomasArr
            });

            // 2. Recarga el medicamento actualizado
            const meds = await getMedicamentos();
            const medicamentoActualizado = meds.find(m => m.id === medicamento.id);

            // 3. Programa la notificación correctamente
            await programarNotificacionesMedicamento(medicamentoActualizado, { dias, hora });

            // 4. Navega al listado de medicamentos
            Alert.alert('¡Listo!', 'Frecuencia personalizada guardada y recordatorios programados.', [
                { text: 'OK', onPress: () => navigation.navigate('ListaMedicamentos') }
            ]);
        } catch (e) {
            Alert.alert('Error', 'No se pudo guardar la frecuencia personalizada.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={[estilos.nombreMedicamento, { marginBottom: 8 }]}>{medicamento.nombre}</Text>
                <Text style={estilos.titulo}>Selecciona días y hora</Text>

                <Text style={[estilos.tituloToma, { marginTop: 14 }]}>Días de la semana:</Text>
                <View style={estilos.diasSemanaContainer}>
                    {diasSemana.map(dia =>
                        <TouchableOpacity
                            key={dia.key}
                            onPress={() => toggleDia(dia.key)}
                            style={[
                                estilos.diaSemanaBtn,
                                dias.includes(dia.key) && estilos.diaSemanaBtnActivo
                            ]}
                        >
                            <Text style={[
                                estilos.diaSemanaTexto,
                                dias.includes(dia.key) && estilos.diaSemanaTextoActivo
                            ]}>
                                {dia.nombre}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={estilos.tituloToma}>Hora:</Text>
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={[estilos.input, { marginBottom: 22, width: 160, alignSelf: 'center' }]}
                >
                    <Text style={estilos.textoHoraGrande}>
                        {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </TouchableOpacity>
                {showPicker && (
                    <DateTimePicker
                        value={hora}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(_, selectedDate) => {
                            setShowPicker(false);
                            if (selectedDate) setHora(selectedDate);
                        }}
                    />
                )}

                <TouchableOpacity
                    style={estilos.botonGrande}
                    onPress={guardar}
                    disabled={loading}
                >
                    <Text style={estilos.textoBotonGrande}>
                        {loading ? 'Guardando...' : 'Guardar frecuencia personalizada'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
