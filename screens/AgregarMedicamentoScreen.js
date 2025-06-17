// src/screen/AgregarMedicamentoScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Platform,
    Keyboard,
    Alert,
    Image,
    Modal,
    ActivityIndicator,
    Linking,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native';
import { addMedicamento } from '../services/storage';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { autocompleteCIMA } from '../utils/cimaAutocomplete';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

const windowHeight = Dimensions.get('window').height;

export default function AgregarMedicamentoScreen({ navigation, route }) {
    const { tamaño } = useAppTheme();
    const estilos = getEstilosApp(tamaño);

    const [codigoBarra, setCodigoBarra] = useState('');
    const [photoUri, setPhotoUri] = useState('');
    const [nombre, setNombre] = useState('');
    const [dosis, setDosis] = useState('');

    // Campos de CIMA:
    const [tamanioPresentacion, setTamanioPresentacion] = useState('');
    const [formaFarmaceutica, setFormaFarmaceutica] = useState('');
    const [viasAdministracion, setViasAdministracion] = useState('');
    const [laboratorio, setLaboratorio] = useState('');
    const [principioActivo, setPrincipioActivo] = useState('');
    const [prospectoUrl, setProspectoUrl] = useState('');
    const [fotoCIMA, setFotoCIMA] = useState('');

    const [loadingAPI, setLoadingAPI] = useState(false);

    // Grabación de audio
    const [grabando, setGrabando] = useState(false);
    const [grabacion, setGrabacion] = useState(null);
    const [audioURI, setAudioURI] = useState('');

    // Imagen ampliable
    const [showFullImage, setShowFullImage] = useState(false);

    // Código de ESCÁNER
    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.codigoEscaneado) {
                handleScan(route.params.codigoEscaneado);
                navigation.setParams({ codigoEscaneado: undefined });
            }
        }, [route.params?.codigoEscaneado])
    );

    //Foto 
    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.fotoMedicamento) {
                setPhotoUri(route.params.fotoMedicamento);
                navigation.setParams({ fotoMedicamento: undefined });
            }
        }, [route.params?.fotoMedicamento])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.medicamentoManual) {
                const med = route.params.medicamentoManual;
                setNombre(med.nombre || '');
                setDosis(med.dosis || med.tamanioPresentacion || '');
                setTamanioPresentacion(med.tamanioPresentacion || med.dosis || '');
                setFormaFarmaceutica(med.formaFarmaceutica || '');
                setViasAdministracion(med.viasAdministracion || '');
                setLaboratorio(med.laboratorio || '');
                setPrincipioActivo(med.principioActivo || '');
                setProspectoUrl(med.prospectoUrl || '');
                setFotoCIMA(med.fotoCIMA || '');
                navigation.setParams({ medicamentoManual: undefined });
            }
        }, [route.params?.medicamentoManual])
    );

    const openEscaner = () => {
        navigation.navigate('Escaner', { mode: 'scan', returnTo: 'AgregarMedicamento' });
    };
    const openCamera = () => {
        navigation.navigate('Escaner', { mode: 'photo', returnTo: 'AgregarMedicamento' });
    };

    // Maneja el código escaneado y consulta la API CIMA
    const handleScan = async (codigo) => {
        setCodigoBarra(codigo);
        setLoadingAPI(true);
        try {
            const result = await autocompleteCIMA(codigo);
            if (result) {
                setNombre(result.nombre);
                setDosis(result.dosis);
                setTamanioPresentacion(result.tamanioPresentacion);
                setFormaFarmaceutica(result.formaFarmaceutica);
                setViasAdministracion(result.viasAdministracion);
                setLaboratorio(result.laboratorio);
                setPrincipioActivo(result.principioActivo);
                setProspectoUrl(result.prospectoUrl);
                setFotoCIMA(result.fotoCIMA);
                Alert.alert('¡Auto-completado!', `Medicamento encontrado:\n${result.nombre}\n${result.dosis}`);
            } else {
                Alert.alert('No encontrado', 'No se han encontrado datos para este código.');
            }
        } catch (e) {
            Alert.alert('Error', e.message || 'No se pudo conectar con la API de medicamentos.');
        }
        setLoadingAPI(false);
    };

    // --- GRABACIÓN DE AUDIO ---
    async function empezarGrabacion() {
        try {
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
        setGrabando(false);
        if (!grabacion) return;
        await grabacion.stopAndUnloadAsync();
        const uri = grabacion.getURI();
        setAudioURI(uri);
        setGrabacion(null);
    }


    const guardar = async () => {
        Keyboard.dismiss();
        if (!nombre || !dosis) {
            Alert.alert('Campo incompleto', 'Completa todos los campos marcados.');
            return;
        }
        let nuevo;
        try {
            nuevo = {
                id: Date.now().toString(),
                nombre,
                dosis,
                codigoBarra,
                photoUri,
                audioURI,
                tamanioPresentacion,
                formaFarmaceutica,
                viasAdministracion,
                laboratorio,
                principioActivo,
                prospectoUrl,
                fotoCIMA
            };
        } catch (e) {
            Alert.alert('Error interno', 'No se pudo crear el objeto medicamento');
            return;
        }
        try {
            await addMedicamento(nuevo);
            Alert.alert('¡Guardado!', 'Medicamento añadido correctamente.', [
                {
                    text: 'OK',
                    style: 'default',
                    onPress: () => navigation.navigate('SeleccionarFrecuencia', { medicamento: nuevo })
                }
            ]);
        } catch (e) {
            Alert.alert('Error', 'No se pudo guardar');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#f8fafd' }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={estilos.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={estilos.titulo}>Agregar Medicamento</Text>

                {/* Botones de acción: uno debajo de otro */}
                <TouchableOpacity
                    style={estilos.botonGrande}
                    onPress={openEscaner}
                    accessibilityLabel="Escanear código de barras"
                >
                    <Ionicons name="barcode-outline" size={32} color="#fff" />
                    <Text style={estilos.textoBotonGrande}>Escanear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={estilos.botonGrande}
                    onPress={openCamera}
                    accessibilityLabel="Tomar foto"
                >
                    <Ionicons name="camera-outline" size={32} color="#fff" />
                    <Text style={estilos.textoBotonGrande}>Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('BuscarMedicamentoManual')}
                    style={estilos.botonGrande}
                >
                    <Ionicons name="search" size={estilos.textoBotonGrande.fontSize + 6} color="#fff" />
                    <Text style={estilos.textoBotonGrande}>Buscar manualmente</Text>
                </TouchableOpacity>

                {/* Imagen ampliable */}
                <View style={{ alignItems: 'center' }}>
                    {(photoUri || fotoCIMA) ? (
                        <TouchableOpacity onPress={() => setShowFullImage(true)}>
                            <Image
                                source={{ uri: photoUri || fotoCIMA }}
                                style={estilos.fotoGrande}
                                accessibilityLabel="Imagen del medicamento"
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={estilos.fotoPlaceholder}>
                            <Ionicons name="image" size={60} color="#bbb" />
                        </View>
                    )}
                </View>
                {/* Modal imagen completa */}
                <Modal
                    visible={showFullImage}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowFullImage(false)}
                >
                    <View style={estilos.modalOverlay}>
                        <TouchableOpacity style={estilos.closeModalBtn} onPress={() => setShowFullImage(false)}>
                            <Ionicons name="close" size={44} color="#fff" />
                        </TouchableOpacity>
                        <Image source={{ uri: photoUri || fotoCIMA }} style={estilos.fullScreenImg} resizeMode="contain" />
                    </View>
                </Modal>
                {codigoBarra ? <Text style={estilos.texto}>Código: {codigoBarra}</Text> : null}
                {loadingAPI && (
                    <View style={{ marginVertical: 10 }}>
                        <ActivityIndicator size="large" color="#1e90ff" />
                        <Text style={[estilos.texto, { color: '#1e90ff' }]}>Buscando datos en CIMA...</Text>
                    </View>
                )}

                {/* Inputs grandes */}
                <TextInput
                    style={estilos.input}
                    placeholder="Nombre del medicamento"
                    placeholderTextColor="#aaa"
                    value={nombre}
                    onChangeText={setNombre}
                    autoFocus
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Dosis/Tamaño"
                    placeholderTextColor="#aaa"
                    value={tamanioPresentacion}
                    onChangeText={setTamanioPresentacion}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Forma farmacéutica"
                    placeholderTextColor="#aaa"
                    value={formaFarmaceutica}
                    onChangeText={setFormaFarmaceutica}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Vía de administración"
                    placeholderTextColor="#aaa"
                    value={viasAdministracion}
                    onChangeText={setViasAdministracion}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Laboratorio"
                    placeholderTextColor="#aaa"
                    value={laboratorio}
                    onChangeText={setLaboratorio}
                />
                <TextInput
                    style={estilos.input}
                    placeholder="Principio activo"
                    placeholderTextColor="#aaa"
                    value={principioActivo}
                    onChangeText={setPrincipioActivo}
                />

                {prospectoUrl ? (
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Abrir prospecto',
                                'El prospecto se abrirá en el navegador.',
                                [
                                    { text: 'Cancelar', style: 'cancel' },
                                    {
                                        text: 'Abrir',
                                        style: 'default',
                                        onPress: () => Linking.openURL(prospectoUrl)
                                    }
                                ]
                            );
                        }}
                        style={estilos.prospectoLink}
                    >
                        <Text style={estilos.prospectoLink}>Ver prospecto</Text>
                    </TouchableOpacity>
                ) : null}


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
                {audioURI ? (
                    <TouchableOpacity
                        style={[estilos.botonGrande, { backgroundColor: '#27ae60' }]}
                        onPress={async () => {
                            const { sound } = await Audio.Sound.createAsync({ uri: audioURI });
                            await sound.playAsync();
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
                {/* BOTÓN CANCELAR */}
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
