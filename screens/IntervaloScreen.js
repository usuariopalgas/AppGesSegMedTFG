// src/screen/IntervaloScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';
import { updateMedicamento, getMedicamentos } from '../services/storage';
import { programarNotificacionesMedicamento } from '../services/notificaciones';

export default function IntervaloScreen({ navigation, route }) {
    const { medicamento } = route.params;
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const [tipo, setTipo] = useState('dias'); // 'dias' o 'horas'
    const [valor, setValor] = useState(1);
    const [hora, setHora] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const aumentar = () => setValor(v => Math.min(v + 1, tipo === 'dias' ? 30 : 24));
    const disminuir = () => setValor(v => Math.max(v - 1, 1));

    const guardar = async () => {
        setLoading(true);
        try {
            const desc = tipo === 'dias'
                ? `Cada ${valor} día${valor > 1 ? 's' : ''} a las ${hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : `Cada ${valor} hora${valor > 1 ? 's' : ''} empezando a las ${hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            // 1. Genera el array de tomas para los próximos N días (si es por días)
            const N_DIAS = 14;
            let tomasArr = [];
            if (tipo === 'dias') {
                for (let d = 0; d < N_DIAS; d += valor) {
                    const fechaBase = new Date();
                    fechaBase.setDate(fechaBase.getDate() + d);
                    const fechaISO = fechaBase.toISOString().split('T')[0];
                    tomasArr.push({
                        fecha: fechaISO,
                        hora: hora.toTimeString().slice(0, 5),
                        estado: 'pendiente'
                    });
                }
            } else if (tipo === 'horas') {
                // Para cada día, genera varias tomas cada X horas desde la hora inicial
                for (let d = 0; d < N_DIAS; d++) {
                    const fechaBase = new Date();
                    fechaBase.setDate(fechaBase.getDate() + d);
                    let hourStart = hora.getHours();
                    const minute = hora.getMinutes();
                    const vecesPorDia = Math.floor(24 / valor);
                    for (let i = 0; i < vecesPorDia; i++) {
                        const tomaHora = ((hourStart + i * valor) % 24).toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');
                        const fechaISO = fechaBase.toISOString().split('T')[0];
                        tomasArr.push({
                            fecha: fechaISO,
                            hora: tomaHora,
                            estado: 'pendiente'
                        });
                    }
                }
            }

            // 2. Guarda la frecuencia y tomas en el medicamento
            await updateMedicamento(medicamento.id, {
                frecuencia: desc,
                tipo,
                valor,
                hora: hora,
                tomas: tomasArr
            });

            // 3. Recarga el medicamento actualizado
            const meds = await getMedicamentos();
            const medicamentoActualizado = meds.find(m => m.id === medicamento.id);

            // 4. Programa la notificación correctamente
            await programarNotificacionesMedicamento(medicamentoActualizado, { tipo, valor, hora });

            // 5. Navega al listado de medicamentos
            Alert.alert('¡Listo!', 'Configuración guardada y recordatorios programados.', [
                { text: 'OK', onPress: () => navigation.navigate('ListaMedicamentos') }
            ]);
        } catch (e) {
            Alert.alert('Error', 'No se pudo guardar el intervalo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={estilos.titulo}>Intervalo</Text>
                <View style={{ flexDirection: 'row', marginBottom: 18, justifyContent: 'center' }}>
                    <TouchableOpacity
                        style={[estilos.botonOpcionHorizontal, tipo === 'dias' && estilos.botonOpcionHorizontalActivo]}
                        onPress={() => setTipo('dias')}
                    >
                        <Text style={[
                            estilos.textoOpcionHorizontal,
                            tipo === 'dias' && estilos.textoOpcionHorizontalActivo
                        ]}>Cada X días</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[estilos.botonOpcionHorizontal, tipo === 'horas' && estilos.botonOpcionHorizontalActivo]}
                        onPress={() => setTipo('horas')}
                    >
                        <Text style={[
                            estilos.textoOpcionHorizontal,
                            tipo === 'horas' && estilos.textoOpcionHorizontalActivo
                        ]}>Cada X horas</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Text style={estilos.texto}>
                        {tipo === 'dias' ? 'Cada' : 'Cada'} <Text style={{ fontWeight: 'bold' }}>{valor}</Text> {tipo === 'dias' ? 'día(s)' : 'hora(s)'}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <TouchableOpacity style={estilos.botonControlPequeño} onPress={disminuir}>
                            <Text style={estilos.textoBotonControlPequeño}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={estilos.botonControlPequeño} onPress={aumentar}>
                            <Text style={estilos.textoBotonControlPequeño}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={estilos.texto}>Hora de inicio:</Text>
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={[estilos.input, { marginBottom: 22, width: 180, alignSelf: 'center' }]}
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
                <TouchableOpacity style={[estilos.botonGrande, { marginTop: 18 }]} onPress={guardar} disabled={loading}>
                    <Text style={estilos.textoBotonGrande}>
                        {loading ? 'Guardando...' : 'Guardar intervalo'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
