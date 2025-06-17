import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function GrabadoraAudio({ onAudioUri, onClose }) {
    const [grabando, setGrabando] = useState(false);
    const grabadorRef = useRef(null);

    const iniciarGrabacion = async () => {
        const permiso = await Audio.requestPermissionsAsync();
        if (permiso.status !== 'granted') {
            alert('Se requiere permiso para grabar');
            return;
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        grabadorRef.current = recording;
        setGrabando(true);
    };

    const detenerGrabacion = async () => {
        await grabadorRef.current.stopAndUnloadAsync();
        const uri = grabadorRef.current.getURI();
        setGrabando(false);
        onAudioUri(uri); // 🔁 Lo enviamos al componente padre
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>🎤 Grabadora de audio</Text>
            <Button
                title={grabando ? 'Detener grabación' : 'Iniciar grabación'}
                onPress={grabando ? detenerGrabacion : iniciarGrabacion}
                color={grabando ? 'red' : 'green'}
            />
            <Button title="Cerrar" onPress={onClose} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: { marginTop: 20, padding: 10 },
    titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    uri: { marginTop: 10, fontSize: 14, color: '#333' },
});
