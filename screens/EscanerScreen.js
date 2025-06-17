// src/screen/EscanerScreen.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// --- Función para extraer el EAN de un QR de medicamento ---
function extraerEANfromQR(qrData) {
    const match = qrData.match(/\(?01\)?(\d{13,14})/);
    if (match) {
        let ean = match[1];
        if (ean.length === 14 && ean.startsWith('0')) ean = ean.slice(1);
        if (ean.length === 13) return ean;
    }
    const match2 = qrData.match(/(\d{13})/);
    if (match2) return match2[1];
    return null;
}

export default function EscanerScreen({ navigation, route }) {
    const cameraRef = useRef(null);
    const [permission, request] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const mode = route.params?.mode || 'scan'; // 'scan' o 'photo'
    const returnTo = route.params?.returnTo || 'AgregarMedicamento';
    const id = route.params?.id;

    const [takingPhoto, setTakingPhoto] = useState(false);
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const buscarManual = () => {
        setScanned(false);
        navigation.goBack();
        setTimeout(() => {
            navigation.navigate('BuscarMedicamentoManual');
        }, 500);
    };


    const handleBarcode = ({ data, type }) => {
        if (!scanned && mode === 'scan') {
            setScanned(true);

            // Primero intenta extraer EAN de Data Matrix / QR
            const ean = extraerEANfromQR(data);
            if (ean) {
                navigation.navigate({
                    name: returnTo,
                    params: { codigoEscaneado: ean, id },
                    merge: true,
                });
                return;
            }
            // Si es un número largo
            if (/^\d{7,15}$/.test(data)) {
                navigation.navigate({
                    name: returnTo,
                    params: { codigoEscaneado: data, id },
                    merge: true,
                });
                return;
            }
            // Si es una URL
            if (/^https?:\/\//i.test(data)) {
                Alert.alert(
                    'Código QR detectado',
                    'Este QR contiene un enlace, no un código de medicamento. ¿Quieres abrirlo?',
                    [
                        { text: 'Cancelar', style: 'cancel', onPress: () => setScanned(false) },
                        { text: 'Abrir enlace', onPress: () => { setScanned(false); Linking.openURL(data); } }
                    ]
                );
                return;
            }
            Alert.alert(
                'No se pudo leer el medicamento',
                'El código escaneado no corresponde a un medicamento reconocido. Puedes intentar buscarlo manualmente.',
                [
                    { text: 'Buscar manualmente', onPress: buscarManual },
                    { text: 'Intentar de nuevo', onPress: () => setScanned(false) }
                ]
            );
        }
    };

    const handlePhoto = async () => {
        if (cameraRef.current && mode === 'photo') {
            try {
                setTakingPhoto(true);
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
                setTakingPhoto(false);
                navigation.navigate({
                    name: returnTo,
                    params: { fotoMedicamento: photo.uri, id },
                    merge: true,
                });
            } catch (e) {
                setTakingPhoto(false);
                Alert.alert('Error', 'No se pudo tomar la foto');
            }
        }
    };

    const renderOverlayLines = () => (
        <View pointerEvents="none" style={styles.guideOverlay}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
        </View>
    );

    if (!permission) return <View style={styles.center}><Text>Solicitando permiso...</Text></View>;
    if (!permission.granted)
        return (
            <View style={styles.center}>
                <Text>Permiso denegado.</Text>
                <TouchableOpacity onPress={request} style={styles.btn}><Text style={styles.btnText}>Permitir</Text></TouchableOpacity>
            </View>
        );

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                isActive={true}
                barcodeScannerEnabled={mode === 'scan'}
                onBarcodeScanned={mode === 'scan' ? handleBarcode : undefined}
                barcodeScannerSettings={{
                    barcodeTypes: [
                        'qr',
                        'ean13',
                        'code128',
                        'code39',
                        'ean8',
                        'upc_a',
                        'upc_e',
                        'pdf417',
                        'itf14',
                        'datamatrix',
                    ]
                }}
            />
            {renderOverlayLines()}
            <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="close" size={36} color="#fff" />
            </TouchableOpacity>
            <View style={styles.centerText}>
                <Text style={[styles.infoText, { fontSize: estilos.texto.fontSize + 2 }]}>
                    {mode === 'scan'
                        ? 'Escanee el código de barras o QR en el recuadro.'
                        : 'Enfoque el medicamento y pulse la cámara'}
                </Text>
            </View>
            {mode === 'photo' && (
                <View style={styles.overlay}>
                    <TouchableOpacity onPress={handlePhoto} style={styles.photoBtn} disabled={takingPhoto}>
                        <Ionicons name="camera-outline" size={38} color="#fff" />
                    </TouchableOpacity>
                    {takingPhoto && <Text style={styles.takingPhotoText}>Tomando foto...</Text>}
                </View>
            )}
        </View>
    );
}


const overlayBoxSize = Math.min(windowWidth, windowHeight) * 0.76;
const cornerLength = 34;
const cornerThickness = 5;
const cornerRadius = 14;
const cornerColor = "#1e90ff";

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    btn: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 8, marginTop: 14 },
    btnText: { color: '#fff', fontWeight: 'bold' },
    closeBtn: {
        position: 'absolute',
        top: 44,
        left: 24,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 18,
        padding: 4
    },
    overlay: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center'
    },
    photoBtn: {
        backgroundColor: '#1e90ffcc',
        padding: 18,
        borderRadius: 60
    },
    takingPhotoText: {
        color: '#fff',
        backgroundColor: '#0009',
        padding: 8,
        borderRadius: 9,
        marginTop: 10,
        fontSize: 17
    },
    centerText: { position: 'absolute', top: '11%', width: '100%', alignItems: 'center' },
    infoText: { color: '#fff', backgroundColor: '#0007', padding: 8, borderRadius: 9 },
    // Overlay guías esquineras (cuadro guía)
    guideOverlay: {
        position: 'absolute',
        left: (windowWidth - overlayBoxSize) / 2,
        top: (windowHeight - overlayBoxSize) / 2,
        width: overlayBoxSize,
        height: overlayBoxSize,
        zIndex: 11,
        pointerEvents: 'none'
    },
    corner: {
        position: 'absolute',
        width: cornerLength,
        height: cornerLength,
        borderColor: cornerColor,
        zIndex: 12,
    },
    tl: {
        left: 0, top: 0,
        borderLeftWidth: cornerThickness,
        borderTopWidth: cornerThickness,
        borderTopLeftRadius: cornerRadius
    },
    tr: {
        right: 0, top: 0,
        borderRightWidth: cornerThickness,
        borderTopWidth: cornerThickness,
        borderTopRightRadius: cornerRadius
    },
    bl: {
        left: 0, bottom: 0,
        borderLeftWidth: cornerThickness,
        borderBottomWidth: cornerThickness,
        borderBottomLeftRadius: cornerRadius
    },
    br: {
        right: 0, bottom: 0,
        borderRightWidth: cornerThickness,
        borderBottomWidth: cornerThickness,
        borderBottomRightRadius: cornerRadius
    },
});
