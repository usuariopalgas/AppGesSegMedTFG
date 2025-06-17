// src/components/CameraScanner.js
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

/**
 * Componente reutilizable para escaneo de códigos y toma de fotos.
 * Props:
 *  - onScanned(data: string): callback cuando se detecta un código.
 *  - onPhotoTaken(uri: string): callback cuando se toma una foto.
 */
export default function CameraScanner({ onScanned, onPhotoTaken }) {
    // Permisos de cámara
    const [permission, request] = useCameraPermissions();
    const cameraRef = useRef(null);

    // Modo de operación y orientación
    const [mode, setMode] = useState('scan');    // 'scan' o 'photo'
    const [facing, setFacing] = useState('back'); // 'back' o 'front'

    // Estado interno para mostrar datos en UI si se desea
    const [scannedData, setScannedData] = useState('');
    const [photoUri, setPhotoUri] = useState('');

    // Manejo de permisos
    if (!permission) {
        return (
            <View style={styles.center}>
                <Text>⏳ Solicitando permiso de cámara…</Text>
            </View>
        );
    }
    if (Platform.OS === 'web') {
        return (
            <View style={styles.center}>
                <Text>🚫 Cámara no disponible en web.</Text>
            </View>
        );
    }
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>⚠️ Permiso denegado.</Text>
                <TouchableOpacity onPress={request} style={styles.btn}>
                    <Text style={styles.btnText}>Conceder permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Callback de escaneo
    const handleBarcode = ({ data }) => {
        if (mode === 'scan') {
            setScannedData(data);
            onScanned(data);
            Alert.alert('Código escaneado', data);
        }
    };

    // Callback de foto
    const handlePhoto = async () => {
        if (cameraRef.current && mode === 'photo') {
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
                setPhotoUri(photo.uri);
                onPhotoTaken(photo.uri);
                Alert.alert('📸 Foto capturada', photo.uri.split('/').pop());
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
                isActive={true}
                barcodeScannerEnabled
                onBarcodeScanned={handleBarcode}
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'code128', 'qr'] }}
            />

            {/* Mensaje para escaneo */}
            {mode === 'scan' && (
                <View style={styles.msgContainer}>
                    <Text style={styles.msgText}>
                        {scannedData || 'Acerca la cámara a un código…'}
                    </Text>
                </View>
            )}

            {/* Controles */}
            <View style={styles.topControls}>
                <TouchableOpacity onPress={() => setMode('scan')} style={[styles.btnMode, mode === 'scan' && styles.active]}>
                    <Text style={styles.btnText}>Escanear</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('photo')} style={[styles.btnMode, mode === 'photo' && styles.active]}>
                    <Text style={styles.btnText}>Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')} style={styles.btnFlip}>
                    <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Botón de acción (foto) */}
            {mode === 'photo' && (
                <TouchableOpacity onPress={handlePhoto} style={styles.btnAction}>
                    <Ionicons name="camera-outline" size={32} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    camera: { flex: 1 },
    btn: { marginTop: 16, padding: 10, backgroundColor: '#1e90ff', borderRadius: 6 },
    btnText: { color: '#fff' },
    msgContainer: { position: 'absolute', bottom: 120, left: 0, right: 0, alignItems: 'center' },
    msgText: { color: '#fff', backgroundColor: '#0008', padding: 6, borderRadius: 4 },
    topControls: { position: 'absolute', top: 40, left: 20, flexDirection: 'row' },
    btnMode: { marginRight: 10, padding: 8, backgroundColor: '#0008', borderRadius: 6 },
    active: { backgroundColor: '#1e90ff' },
    btnFlip: { padding: 8, backgroundColor: '#0008', borderRadius: 6 },
    btnAction: { position: 'absolute', bottom: 220, alignSelf: 'center', backgroundColor: '#0008', padding: 12, borderRadius: 50 }
});
