// src/screen/ChatScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    SafeAreaView,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import uuid from 'react-native-uuid';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

import FAQBot from '../bot/FAQBot';
import { getEstilosApp, FondoDecorativo } from '../styles/estilosApp';
import { useAppTheme } from '../context/AppThemeContext';
import { UserContext } from '../context/UserContext';

export default function ChatScreen() {
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);
    const { name } = useContext(UserContext);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [grabando, setGrabando] = useState(false);

    useEffect(() => {
        (async () => {
            const raw = await AsyncStorage.getItem('chatHistorial');
            const hist = raw ? JSON.parse(raw) : [];
            if (!hist.length) {
                hist.push({
                    id: uuid.v4(),
                    text: '¡Hola!, cuéntame, ¿en qué puedo ayudarte hoy? pregúntame lo que necesites',
                    author: 'bot',
                    timestamp: Date.now(),
                });
            }
            setMessages(hist);
            setLoading(false);
        })();
    }, []);

    const persist = async (newMsgs) => {
        await AsyncStorage.setItem('chatHistorial', JSON.stringify(newMsgs));
    };

    const addMessage = (text, author) => {
        const msg = { id: uuid.v4(), text, author, timestamp: Date.now() };
        setMessages(prev => {
            const updated = [msg, ...prev];
            persist(updated);
            return updated;
        });
    };

    const handleSend = (text) => {
        if (!text.trim()) return;
        addMessage(text, 'user');
        const resp = FAQBot.getResponse(text);
        addMessage(resp, 'bot');
        Speech.speak(resp, { language: 'es' });
        setInput('');
    };

    const handleVoiceResult = e => {
        try {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.text) handleSend(data.text);
        } catch { }
        setGrabando(false);
    };


    const onClear = () => {
        Alert.alert(
            '¿Borrar chat?',
            '¿Seguro que quieres eliminar el contenido actual?',
            [
                { text: 'CANCELAR', style: 'cancel' },
                {
                    text: 'ELIMINAR',
                    style: 'destructive',
                    onPress: () => {
                        setMessages([{
                            id: uuid.v4(),
                            text: '¡Hola!, cuéntame, ¿en qué puedo ayudarte hoy? pregúntame lo que necesites',
                            author: 'bot',
                            timestamp: Date.now(),
                        }]);
                    }
                },
            ]
        );
    };

    const onHistory = () => {
        Alert.alert('Historial', 'El chat queda guardado para futuras consultas.');
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" color={estilos.colorPrimario} />;
    }

    return (

        <SafeAreaView style={estilos.container} edges={['top', 'left', 'right']}>
            <FondoDecorativo />
            {/* HEADER */}
            <View style={estilos.headerContainer}>

                <Text style={estilos.headerTitle}>
                    <Ionicons name="chatbubbles-outline" size={estilos.icono} color={estilos.colorPrimario} /> Conversar
                </Text>
                <View style={estilos.headerSide}>
                    <TouchableOpacity onPress={onHistory} style={estilos.headerBtn}>
                        <Ionicons name="time-outline" size={estilos.icono} color={estilos.colorPrimario} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClear} style={estilos.headerBtn}>
                        <Ionicons name="trash-outline" size={estilos.icono} color={estilos.colorPeligro} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* CHAT */}
            <FlatList
                data={messages}
                inverted
                keyExtractor={i => i.id}
                renderItem={({ item }) => (
                    <View style={[
                        estilos.msgContainer,
                        item.author === 'user'
                            ? estilos.user
                            : estilos.bot
                    ]}>
                        <Text style={estilos.msgText}>{item.text}</Text>
                    </View>
                )}
            />

            {/* QUICK REPLIES */}
            <View style={estilos.qrContainer}>
                {FAQBot.quickReplies.map(q => (
                    <TouchableOpacity
                        key={q.value}
                        style={[
                            estilos.qrButton,
                            { backgroundColor: estilos.colorPrimario }
                        ]}
                        onPress={() => handleSend(q.value)}
                    >
                        <Text style={estilos.qrText}>{q.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* INPUT + BOTONES */}
            <View style={estilos.inputRow}>
                <TextInput
                    style={estilos.chatinput}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Haz una pregunta..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    onPress={() => handleSend(input)}
                    style={[estilos.sendBtn, { backgroundColor: estilos.colorPrimario }]}
                >
                    <Ionicons name="send" size={estilos.icono} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setGrabando(true)}
                    style={[estilos.micBtn, { backgroundColor: estilos.colorPrimario }]}
                >
                    <Ionicons name="mic" size={estilos.icono} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* MODAL DE VOZ */}
            <Modal
                visible={grabando}
                animationType="slide"
                onRequestClose={() => setGrabando(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={estilos.headerContainer}>
                        <Text style={estilos.headerTitle}>Dictado por voz</Text>
                        <TouchableOpacity onPress={() => setGrabando(false)} style={estilos.headerBtn}>
                            <Ionicons name="close" size={estilos.icono} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <WebView
                        originWhitelist={['*']}
                        style={{ flex: 1 }}
                        source={{
                            html: `
                <html>
                  <head>
                    <style>
                      body { font-family: Arial, sans-serif; background: #fff; }
                      .escuchando {
                        font-size: ${estilos.fuente}px;
                        color: ${estilos.colorPrimario};
                        text-align: center;
                        margin-top: 30px;
                      }
                    </style>
                  </head>
                  <body>
                    <script>
                      const r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                      r.lang = 'es-ES';
                      r.interimResults = false;
                      r.maxAlternatives = 1;
                      r.onresult = e => window.ReactNativeWebView.postMessage(JSON.stringify({text:e.results[0][0].transcript}));
                      r.onerror = () => window.ReactNativeWebView.postMessage(JSON.stringify({text:''}));
                      r.start();
                    </script>
                    <div class="escuchando">Escuchando…</div>
                  </body>
                </html>
              `
                        }}
                        onMessage={handleVoiceResult}
                    />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}
