// src/screen/EditarMedicamentoScreen.js
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Linking
} from 'react-native';
import { Audio } from 'expo-av';
import { getMedicamentos, updateMedicamento } from '../services/storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

export default function EditarMedicamentoScreen({ route, navigation }) {
    const { id } = route.params;
    const [med, setMed] = useState(null);
    const [grabando, setGrabando] = useState(false);
    const [grabacion, setGrabacion] = useState(null);

    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const lista = await getMedicamentos();
                const m = lista.find(item => item.id === id);
                if (!m) {
                    Alert.alert('Error', 'Medicamento no encontrado');
                    navigation.goBack();
                    return;
                }
                setMed(m);
            })();
        }, [id])
    );

    async function empezarGrabacion() {
        try {
            if (grabacion) {
                await grabacion.stopAndUnloadAsync();
                setGrabacion(null);
            }
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado');
                return;
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setGrabando(true);
            setGrabacion(recording);
        } catch (e) {
            Alert.alert('Error', 'No se pudo iniciar la grabación');
        }
    }

    async function pararGrabacion() {
        if (!grabacion) return;
        setGrabando(false);
        await grabacion.stopAndUnloadAsync();
        const uri = grabacion.getURI();
        setMed(prev => ({ ...prev, audioURI: uri }));
        setGrabacion(null);
    }

    const eliminarFoto = () => {
        Alert.alert(
            'Eliminar foto',
            '¿Seguro que quieres eliminar la foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => setMed(prev => ({ ...prev, photoUri: '' }))
                }
            ]
        );
    };

    const guardar = async () => {
        if (!med.nombre || !med.dosis || !med.frecuencia) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }
        try {
            await updateMedicamento(med.id, med);
            Alert.alert('Éxito', 'Medicamento actualizado');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'No se pudo actualizar');
        }
    };

    if (!med) return <Text style={{ padding: 32 }}>Cargando...</Text>;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#f8fafd' }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={estilos.scrollContent}>
                <Text style={estilos.titulo}>Editar Medicamento</Text>

                {/* Imagen más grande y accesible */}
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                    {med.photoUri
                        ? (
                            <View style={{ alignItems: 'center' }}>
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
                                <TouchableOpacity
                                    onPress={eliminarFoto}
                                    style={{ backgroundColor: '#e74c3c', padding: 9, borderRadius: 6, marginTop: 6, width: 130, alignItems: 'center' }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: estilos.texto.fontSize }}>
                                        Eliminar foto
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
                                justifyContent: 'center'
                            }}>
                                <Ionicons name="image" size={68} color="#ccc" />
                            </View>
                    }
                </View>
                {med.codigoBarra ? <Text style={estilos.texto}>Código: {med.codigoBarra}</Text> : null}

                <TextInput
                    style={estilos.input}
                    placeholder="Nombre del medicamento"
                    value={med.nombre}
                    onChangeText={v => setMed(prev => ({ ...prev, nombre: v }))}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Dosis/Tamaño"
                    value={med.tamanioPresentacion || med.dosis || ''}
                    onChangeText={v => setMed(prev => ({ ...prev, tamanioPresentacion: v, dosis: v }))}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Frecuencia"
                    value={med.frecuencia}
                    onChangeText={v => setMed(prev => ({ ...prev, frecuencia: v }))}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Forma farmacéutica"
                    value={med.formaFarmaceutica || ''}
                    onChangeText={v => setMed(prev => ({ ...prev, formaFarmaceutica: v }))}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Vía de administración"
                    value={med.viasAdministracion || ''}
                    onChangeText={v => setMed(prev => ({ ...prev, viasAdministracion: v }))}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Laboratorio"
                    value={med.laboratorio || ''}
                    onChangeText={v => setMed(prev => ({ ...prev, laboratorio: v }))}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Principio activo"
                    value={med.principioActivo || ''}
                    onChangeText={v => setMed(prev => ({ ...prev, principioActivo: v }))}
                />
                {med.prospectoUrl ? (
                    <TouchableOpacity onPress={() => Linking.openURL(med.prospectoUrl)}>
                        <Text style={estilos.prospectoLink}>Ver prospecto</Text>
                    </TouchableOpacity>
                ) : null}

                {/* Grabación de audio - botones grandes, uno debajo de otro */}
                <TouchableOpacity
                    style={[
                        estilos.botonGrande,
                        grabando && { backgroundColor: '#e67e22' }
                    ]}
                    onPress={grabando ? pararGrabacion : empezarGrabacion}
                    accessibilityLabel="Grabar nota de voz"
                >
                    <Ionicons name={grabando ? "mic" : "mic-outline"} size={30} color="#fff" />
                    <Text style={estilos.textoBotonGrande}>{grabando ? "Grabando..." : "Grabar nota de voz"}</Text>
                </TouchableOpacity>
                {med.audioURI ? (
                    <TouchableOpacity
                        style={[estilos.botonGrande, { backgroundColor: '#27ae60' }]}
                        onPress={async () => {
                            try {
                                const { sound } = await Audio.Sound.createAsync({ uri: med.audioURI });
                                await sound.playAsync();
                            } catch (e) {
                                Alert.alert('Error', 'No se pudo reproducir el audio');
                            }
                        }}
                        accessibilityLabel="Escuchar nota de voz"
                    >
                        <Ionicons name="play" size={30} color="#fff" />
                        <Text style={estilos.textoBotonGrande}>Escuchar nota</Text>
                    </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                    style={[estilos.botonGrande, { backgroundColor: '#1e90ff', marginTop: 24 }]}
                    accessible={true}
                    accessibilityLabel="Guardar medicamento"
                    onPress={guardar}
                >
                    <Ionicons name="save" size={30} color="#fff" />
                    <Text style={estilos.textoBotonGrande}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[estilos.botonGrande, { backgroundColor: '#e74c3c', marginBottom: 24 }]}
                    accessible={true}
                    accessibilityLabel="Cancelar"
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={30} color="#fff" />
                    <Text style={estilos.textoBotonGrande}>Cancelar</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
