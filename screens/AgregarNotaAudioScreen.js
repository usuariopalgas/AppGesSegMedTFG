// src/screen/AgregarNotaAudioScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AgregarMedicamentoScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [dosis, setDosis] = useState('');
    const [frecuencia, setFrecuencia] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [mostrarPickerFecha, setMostrarPickerFecha] = useState(false);
    const [mostrarPickerHora, setMostrarPickerHora] = useState(false);

    const mostrarSelectorFecha = () => setMostrarPickerFecha(true);
    const mostrarSelectorHora = () => setMostrarPickerHora(true);

    const onChangeFecha = (event, selectedDate) => {
        setMostrarPickerFecha(Platform.OS === 'ios');
        if (selectedDate) setFecha(selectedDate);
    };

    const onChangeHora = (event, selectedHour) => {
        setMostrarPickerHora(Platform.OS === 'ios');
        if (selectedHour) setHora(selectedHour);
    };

    const guardarMedicamento = async () => {
        if (!nombre || !dosis || !frecuencia) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        const nuevoMedicamento = {
            id: Date.now().toString(),
            nombre,
            dosis,
            frecuencia,
            fecha: fecha.toISOString().split('T')[0], // yyyy-mm-dd
            hora: hora.toTimeString().split(' ')[0],  // hh:mm:ss
            tomado: false,
        };

        try {
            const datos = await AsyncStorage.getItem('medicamentos');
            const lista = datos ? JSON.parse(datos) : [];
            lista.push(nuevoMedicamento);
            await AsyncStorage.setItem('medicamentos', JSON.stringify(lista));

            Alert.alert('Éxito', 'Medicamento guardado correctamente');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el medicamento');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Agregar Medicamento</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre del medicamento"
                value={nombre}
                onChangeText={setNombre}
            />

            <TextInput
                style={styles.input}
                placeholder="Dosis (ej. 500mg)"
                value={dosis}
                onChangeText={setDosis}
            />

            <TextInput
                style={styles.input}
                placeholder="Frecuencia (ej. 2 veces al día)"
                value={frecuencia}
                onChangeText={setFrecuencia}
            />

            <TouchableOpacity style={styles.input} onPress={mostrarSelectorFecha}>
                <Text>📅 Fecha: {fecha.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.input} onPress={mostrarSelectorHora}>
                <Text>⏰ Hora: {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {mostrarPickerFecha && (
                <DateTimePicker
                    value={fecha}
                    mode="date"
                    display="default"
                    onChange={onChangeFecha}
                    minimumDate={new Date()}
                />
            )}

            {mostrarPickerHora && (
                <DateTimePicker
                    value={hora}
                    mode="time"
                    display="default"
                    onChange={onChangeHora}
                />
            )}

            <TouchableOpacity style={styles.boton} onPress={guardarMedicamento}>
                <Text style={styles.textoBoton}>Guardar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    boton: {
        backgroundColor: '#1e90ff',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBoton: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
