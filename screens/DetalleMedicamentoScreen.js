// src/screen/DetalleMedicamentoScreen.js
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity,
    Linking,
    ActivityIndicator
} from 'react-native';
import { Audio } from 'expo-av';
import { getMedicamentos, deleteMedicamento } from '../services/storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

export default function DetalleMedicamentoScreen({ route, navigation }) {
    const { id } = route.params;
    const [med, setMed] = useState(null);
    const [sound, setSound] = useState(null);
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const lista = await getMedicamentos();
                const m = lista.find(item => item.id === id);
                setMed(m);
            })();
            return () => {
                if (sound) sound.unloadAsync();
            };
        }, [id])
    );

    const reproducirAudio = async () => {
        if (!med?.audioURI) {
            Alert.alert('Sin audio', 'Este medicamento no tiene nota de voz');
            return;
        }
        try {
            if (sound) await sound.unloadAsync();
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: med.audioURI });
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            Alert.alert('Error', 'No se pudo reproducir el audio');
        }
    };

    const confirmarEliminar = () => {
        Alert.alert(
            '¿Eliminar medicamento?',
            '¿Seguro que quieres borrar este medicamento? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteMedicamento(med.id);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const confirmarAbrirProspecto = () => {
        Alert.alert(
            'Abrir prospecto',
            'El prospecto se abrirá en el navegador.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Abrir',
                    style: 'default',
                    onPress: () => Linking.openURL(med.prospectoUrl)
                }
            ]
        );
    };

    if (!med) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafd' }}>
                <ActivityIndicator size="large" color="#1e90ff" />
                <Text style={[{ marginTop: 18 }, estilos.texto]}>Cargando...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={estilos.scrollContent}>
            <Text style={estilos.titulo}>{med.nombre}</Text>

            <View style={{ alignItems: 'center', marginBottom: 14 }}>
                {med.photoUri
                    ? (
                        <Image
                            source={{ uri: med.photoUri }}
                            style={{
                                width: 156,
                                height: 156,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#eaf0f5',
                                backgroundColor: '#f7faff',
                                marginBottom: 9
                            }}
                            accessibilityLabel="Imagen del medicamento"
                        />
                    )
                    : med.fotoCIMA
                        ? <Image
                            source={{ uri: med.fotoCIMA }}
                            style={{
                                width: 156,
                                height: 156,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#eaf0f5',
                                backgroundColor: '#f7faff',
                                marginBottom: 9
                            }}
                            accessibilityLabel="Imagen del medicamento"
                        />
                        : <View style={{
                            width: 156,
                            height: 156,
                            borderRadius: 16,
                            backgroundColor: '#f0f0f0',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 9
                        }}>
                            <Ionicons name="image" size={68} color="#ccc" />
                        </View>
                }
            </View>

            {/* Info principal */}
            <Text style={estilos.texto}>Dosis / Tamaño: {med.tamanioPresentacion || med.dosis || '-'}</Text>
            <Text style={estilos.texto}>Frecuencia: {med.frecuencia || '-'}</Text>
            {med.codigoBarra && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, alignSelf: 'center' }}>
                    <Ionicons name="barcode-outline" size={18} color="#1e90ff" style={{ marginRight: 7 }} />
                    <Text style={[estilos.texto, { color: '#1e90ff', fontWeight: 'bold' }]}>Código: {med.codigoBarra}</Text>
                </View>
            )}
            {med.formaFarmaceutica ? (
                <Text style={estilos.texto}>Forma farmacéutica: {med.formaFarmaceutica}</Text>
            ) : null}
            {med.viasAdministracion ? (
                <Text style={estilos.texto}>Vía de administración: {med.viasAdministracion}</Text>
            ) : null}
            {med.laboratorio ? (
                <Text style={estilos.texto}>Laboratorio: {med.laboratorio}</Text>
            ) : null}
            {med.principioActivo ? (
                <Text style={estilos.texto}>Principio activo: {med.principioActivo}</Text>
            ) : null}
            {med.fecha && <Text style={estilos.texto}>Fecha: {med.fecha}</Text>}
            {med.hora && <Text style={estilos.texto}>Hora: {med.hora}</Text>}
            {med.prospectoUrl ? (
                <TouchableOpacity onPress={confirmarAbrirProspecto}>
                    <Text style={estilos.prospectoLink}>Ver prospecto</Text>
                </TouchableOpacity>
            ) : null}

            {/* BADGE de nota de audio */}
            {med.audioURI && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#1e90ff',
                    borderRadius: 12,
                    paddingHorizontal: 13,
                    paddingVertical: 5,
                    alignSelf: 'center',
                    marginBottom: 5,
                    marginTop: 10
                }}>
                    <Ionicons name="mic" size={18} color="#fff" style={{ marginRight: 5 }} />
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: estilos.texto.fontSize * 0.95 }}>Nota de voz disponible</Text>
                </View>
            )}

            {med.audioURI && (
                <TouchableOpacity
                    style={[estilos.botonGrande, { backgroundColor: '#27ae60', marginBottom: 8 }]}
                    onPress={reproducirAudio}
                    accessibilityLabel="Escuchar nota de voz"
                >
                    <Ionicons name="play" size={30} color="#fff" />
                    <Text style={estilos.textoBotonGrande}>Escuchar nota</Text>
                </TouchableOpacity>
            )}


            <TouchableOpacity
                style={[estilos.botonGrande, { backgroundColor: '#1e90ff' }]}
                onPress={() => navigation.navigate('EditarMedicamento', { id: med.id })}
            >
                <Ionicons name="pencil" size={26} color="#fff" />
                <Text style={estilos.textoBotonGrande}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[estilos.botonGrande, { backgroundColor: '#e74c3c', marginBottom: 24 }]}
                onPress={confirmarEliminar}
            >
                <Ionicons name="trash" size={26} color="#fff" />
                <Text style={estilos.textoBotonGrande}>Eliminar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
