// src/screen/CiclicoScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';
import { updateMedicamento, getMedicamentos } from '../services/storage';
import { programarNotificacionesMedicamento } from '../services/notificaciones';
import * as Notifications from 'expo-notifications';

export default function CiclicoScreen({ navigation, route }) {
    const { medicamento } = route.params;
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const [diasToma, setDiasToma] = useState(21);
    const [diasPausa, setDiasPausa] = useState(7);
    const [fecha, setFecha] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const guardar = async () => {
        setLoading(true);
        try {
            const desc = `Modo cíclico: ${diasToma} días de medicación, ${diasPausa} de pausa, inicia el ${fecha.toLocaleDateString()} a las ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            // Cancelar notificaciones antiguas si hay
            const meds = await getMedicamentos();
            const medicamentoPrevio = meds.find(m => m.id === medicamento.id);
            if (medicamentoPrevio && medicamentoPrevio.notificaciones) {
                for (const notifId of medicamentoPrevio.notificaciones) {
                    try { await Notifications.cancelScheduledNotificationAsync(notifId); } catch { }
                }
            }

            // Guardar datos principales del medicamento
            await updateMedicamento(medicamento.id, {
                frecuencia: desc,
                tipoFrecuencia: 'ciclico',
                diasToma,
                diasPausa,
                fechaInicio: fecha,
                notificaciones: [], // Limpia antes de añadir las nuevas
            });

            // Recargar medicamento actualizado
            const medsActualizados = await getMedicamentos();
            const medicamentoActualizado = medsActualizados.find(m => m.id === medicamento.id);

            // Programar notificaciones cíclicas
            const notificationIds = await programarNotificacionesMedicamento(medicamentoActualizado, {
                ciclico: true,
                diasToma,
                diasPausa,
                fecha,
            });

            // Guardar los nuevos IDs de notificaciones
            await updateMedicamento(medicamento.id, { notificaciones: notificationIds });

            Alert.alert('¡Listo!', 'Modo cíclico guardado y notificaciones programadas.', [
                { text: 'OK', onPress: () => navigation.navigate('ListaMedicamentos') }
            ]);
        } catch (e) {
            console.error("Error guardando modo cíclico:", e);
            Alert.alert('Error', 'No se pudo guardar el modo cíclico.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={estilos.titulo}>Modo cíclico</Text>
                <View style={{ marginBottom: 24 }}>
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        <Text style={estilos.tituloToma}>Días de medicación</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity style={estilos.botonControlPequeño} onPress={() => setDiasToma(Math.max(1, diasToma - 1))}>
                                <Text style={estilos.textoBotonControlPequeño}>-</Text>
                            </TouchableOpacity>
                            <Text style={[estilos.textoHoraGrande, { marginHorizontal: 14 }]}>{diasToma}</Text>
                            <TouchableOpacity style={estilos.botonControlPequeño} onPress={() => setDiasToma(diasToma + 1)}>
                                <Text style={estilos.textoBotonControlPequeño}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        <Text style={estilos.tituloToma}>Días de pausa</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity style={estilos.botonControlPequeño} onPress={() => setDiasPausa(Math.max(0, diasPausa - 1))}>
                                <Text style={estilos.textoBotonControlPequeño}>-</Text>
                            </TouchableOpacity>
                            <Text style={[estilos.textoHoraGrande, { marginHorizontal: 14 }]}>{diasPausa}</Text>
                            <TouchableOpacity style={estilos.botonControlPequeño} onPress={() => setDiasPausa(diasPausa + 1)}>
                                <Text style={estilos.textoBotonControlPequeño}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text style={estilos.tituloToma}>Fecha de inicio:</Text>
                <TouchableOpacity
                    onPress={() => setShowPicker('date')}
                    style={[estilos.input, { marginBottom: 18, width: 220, alignSelf: 'center' }]}
                >
                    <Text style={estilos.textoFechaGrande}>
                        {fecha.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>

                <Text style={estilos.tituloToma}>Hora de inicio:</Text>
                <TouchableOpacity
                    onPress={() => setShowPicker('time')}
                    style={[estilos.input, { marginBottom: 24, width: 220, alignSelf: 'center' }]}
                >
                    <Text style={estilos.textoHoraGrande}>
                        {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </TouchableOpacity>

                {showPicker === 'date' && (
                    <DateTimePicker
                        value={fecha}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={(_, selectedDate) => {
                            setShowPicker(false);
                            if (selectedDate) setFecha(new Date(
                                selectedDate.getFullYear(),
                                selectedDate.getMonth(),
                                selectedDate.getDate(),
                                fecha.getHours(),
                                fecha.getMinutes()
                            ));
                        }}
                    />
                )}
                {showPicker === 'time' && (
                    <DateTimePicker
                        value={fecha}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(_, selectedTime) => {
                            setShowPicker(false);
                            if (selectedTime) setFecha(new Date(
                                fecha.getFullYear(),
                                fecha.getMonth(),
                                fecha.getDate(),
                                selectedTime.getHours(),
                                selectedTime.getMinutes()
                            ));
                        }}
                    />
                )}
                <TouchableOpacity style={[estilos.botonGrande, { marginTop: 18 }]} onPress={guardar} disabled={loading}>
                    <Text style={estilos.textoBotonGrande}>{loading ? 'Guardando...' : 'Guardar modo cíclico'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
