import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';
import { updateMedicamento, getMedicamentos } from '../services/storage';
import { programarNotificacionesMedicamento } from '../services/notificaciones';
import * as Notifications from 'expo-notifications';

export default function ElegirHorariosScreen({ navigation, route }) {
    const { medicamento, tomas } = route.params;
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const [momentos, setMomentos] = useState(
        Array.from({ length: tomas }, () => ({ fecha: new Date(), showDate: false, showTime: false }))
    );
    const [loading, setLoading] = useState(false);

    const cambiarFecha = (idx, nuevaFecha) => {
        const nuevos = [...momentos];
        nuevos[idx].fecha = nuevaFecha;
        setMomentos(nuevos);
    };
    const mostrarPicker = (idx, tipo, show) => {
        const nuevos = [...momentos];
        nuevos[idx][tipo === 'date' ? 'showDate' : 'showTime'] = show;
        setMomentos(nuevos);
    };

    const guardar = async () => {
        setLoading(true);
        try {
            const horas = momentos.map(m => m.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).join(' y ');
            const descripcion = `${tomas} vez/veces al día a ${horas}`;

            //Se genera el array de tomas para los próximos N días
            const N_DIAS = 30; //ajustable
            let tomasArr = [];
            for (let d = 0; d < N_DIAS; d++) {
                const fechaBase = new Date();
                fechaBase.setDate(fechaBase.getDate() + d);
                const fechaISO = fechaBase.toISOString().split('T')[0];
                momentos.forEach(m => {
                    tomasArr.push({
                        fecha: fechaISO,
                        hora: m.fecha.toTimeString().slice(0, 5), // "HH:MM"
                        estado: 'pendiente'
                    });
                });
            }

            // Si el medicamento tiene notificaciones antiguas, cancelarlas
            const meds = await getMedicamentos();
            const medicamentoPrevio = meds.find(m => m.id === medicamento.id);
            if (medicamentoPrevio && medicamentoPrevio.notificaciones) {
                for (const notifId of medicamentoPrevio.notificaciones) {
                    try { await Notifications.cancelScheduledNotificationAsync(notifId); } catch { }
                }
            }


            //Actualiza el medicamento con frecuencia y tomas
            await updateMedicamento(medicamento.id, {
                frecuencia: descripcion,
                momentos: momentos.map(m => m.fecha),
                tipoFrecuencia: 'tomasPorDia',
                numeroTomas: tomas,
                tomas: tomasArr,
                notificaciones: [] // Limpia antes de añadir las nuevas
            });


            //Recarga el medicamento actualizado
            const medsActualizados = await getMedicamentos();
            const medicamentoActualizado = medsActualizados.find(m => m.id === medicamento.id);

            //Programa notificaciones según los horarios elegidos y guarda los IDs
            const notificationIds = await programarNotificacionesMedicamento(medicamentoActualizado, { momentos });

            //Guarda los nuevos IDs en el medicamento
            await updateMedicamento(medicamento.id, {
                notificaciones: notificationIds
            });

            //Programa notificaciones según los horarios elegidos (solo una vez)
            const result = await programarNotificacionesMedicamento(medicamentoActualizado, { momentos });
            //console.log("Notificaciones programadas:", result);
            const programadas = await Notifications.getAllScheduledNotificationsAsync();
            //console.log("Programadas en el sistema:", programadas);

            //Navega (o muestra mensaje de éxito)
            Alert.alert('¡Listo!', 'Horarios guardados y recordatorios programados.', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('ListaMedicamentos')
                }
            ]);
        } catch (e) {
            console.error("Error en guardar horarios:", e);
            Alert.alert('Error', 'No se pudo guardar los horarios.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={[estilos.titulo, { marginBottom: 12 }]}>¿Cuándo quieres que te lo recuerden?</Text>
                {momentos.map((momento, idx) => (
                    <View key={idx} style={estilos.bloqueToma}>
                        <Text style={estilos.tituloToma}>Toma {idx + 1}:</Text>
                        <TouchableOpacity
                            style={estilos.input}
                            onPress={() => mostrarPicker(idx, 'date', true)}
                        >
                            <Text style={estilos.textoFechaGrande}>
                                Fecha: {momento.fecha.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                        {momento.showDate && (
                            <DateTimePicker
                                value={momento.fecha}
                                mode="date"
                                display="default"
                                onChange={(_, selectedDate) => {
                                    mostrarPicker(idx, 'date', false);
                                    if (selectedDate) cambiarFecha(idx, new Date(
                                        selectedDate.getFullYear(),
                                        selectedDate.getMonth(),
                                        selectedDate.getDate(),
                                        momento.fecha.getHours(),
                                        momento.fecha.getMinutes()
                                    ));
                                }}
                            />
                        )}
                        <TouchableOpacity
                            style={estilos.input}
                            onPress={() => mostrarPicker(idx, 'time', true)}
                        >
                            <Text style={estilos.textoHoraGrande}>
                                Hora: {momento.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </TouchableOpacity>
                        {momento.showTime && (
                            <DateTimePicker
                                value={momento.fecha}
                                mode="time"
                                display="default"
                                onChange={(_, selectedTime) => {
                                    mostrarPicker(idx, 'time', false);
                                    if (selectedTime) cambiarFecha(idx, new Date(
                                        momento.fecha.getFullYear(),
                                        momento.fecha.getMonth(),
                                        momento.fecha.getDate(),
                                        selectedTime.getHours(),
                                        selectedTime.getMinutes()
                                    ));
                                }}
                            />
                        )}
                    </View>
                ))}
                <TouchableOpacity style={estilos.botonGrande} onPress={guardar} disabled={loading}>
                    <Text style={estilos.textoBotonGrande}>
                        {loading ? 'Guardando...' : 'Guardar horarios'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
