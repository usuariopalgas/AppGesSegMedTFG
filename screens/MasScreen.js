// src/screen/MasScreen.js
import React, { useContext } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotonGrande from '../components/BotonGrande';
import { UserContext } from '../context/UserContext';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MasScreen({ navigation }) {
    const { clearName } = useContext(UserContext);
    const { sizeOption, setSizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    // Botón para resetear app
    const handleResetApp = () => {
        Alert.alert(
            '¿Resetear aplicación?',
            'Esto borrará todos los datos de usuario, medicamentos, preferencias y se volverá al inicio de la app.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Resetear',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        if (clearName) await clearName();
                        // Al borrar el nombre, AppNavigator volverá a la bienvenida automáticamente.
                    }
                }
            ]
        );
    };

    // Botón cambiar nombre
    const handleChangeName = () => {
        Alert.alert(
            'Cambiar nombre',
            '¿Seguro que quieres cambiar tu nombre?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cambiar',
                    onPress: async () => {
                        await clearName();
                    }
                }
            ]
        );
    };

    // Botón eliminar perfil de medicación
    const handleClearMedicationProfile = () => {
        Alert.alert(
            'Eliminar perfil de medicación',
            'Esto solo borrará tus medicamentos, no tu usuario ni otras configuraciones.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const allKeys = await AsyncStorage.getAllKeys();
                        const keep = ['userName', 'bienvenidaCompletada', 'preferencias', 'preferenciaSizeOption'];
                        const toRemove = allKeys.filter(k => !keep.includes(k));
                        await AsyncStorage.multiRemove(toRemove);
                        Alert.alert('Perfil eliminado', 'Los datos de medicación han sido borrados.');
                    }
                }
            ]
        );
    };

    // Selector de tamaño con tooltip accesible
    const renderSelectorSize = () => (
        <View style={{ marginVertical: 20, width: '100%', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={[
                    estilos.titulo,
                    { marginBottom: 0, fontSize: estilos.titulo.fontSize * 1.05 }
                ]}>
                    👁️ Tamaño de letra y botones
                </Text>
                <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Información sobre el tamaño de letra"
                    onPress={() => Alert.alert(
                        '¿Qué es el tamaño de letra?',
                        'Elige el tamaño de letra y de los botones para facilitar la lectura y el uso. Puedes cambiarlo cuando quieras.'
                    )}
                    style={{ marginLeft: 8, padding: 4 }}
                >
                    <Text style={{ fontSize: 22, color: '#1e90ff' }}>ℹ️</Text>
                </TouchableOpacity>
            </View>
            {['normal', 'grande', 'muygrande'].map(opt => (
                <BotonGrande
                    key={opt}
                    title={opt === 'normal' ? 'Compacta'
                        : opt === 'grande' ? 'Legible'
                            : 'Muy legible'}
                    onPress={() => setSizeOption(opt)}
                    style={[
                        estilos.botonGrande,
                        { backgroundColor: sizeOption === opt ? '#27ae60' : '#d3e9fa' }
                    ]}
                    textStyle={{
                        color: sizeOption === opt ? '#fff' : '#222',
                        fontWeight: sizeOption === opt ? 'bold' : 'normal'
                    }}
                    icon={sizeOption === opt ? "checkmark-circle" : undefined}
                    iconColor={sizeOption === opt ? "#fff" : "#1e90ff"}
                />
            ))}
        </View>
    );


    return (
        <SafeAreaView style={estilos.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={[estilos.scrollContent, { alignItems: 'center' }]}>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={[
                        estilos.titulo,
                        {
                            fontSize: estilos.titulo.fontSize * 1.23,
                            textAlign: 'center',
                            marginTop: 12,
                            marginBottom: 0,
                            color: '#1e90ff'
                        }
                    ]}>
                        ⚙️ Configuración
                    </Text>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="¿Qué es la configuración?"
                        onPress={() => Alert.alert(
                            'Configuración',
                            'En esta pantalla puedes cambiar el tamaño de letra, tu nombre, eliminar tus datos. Tú decides.'
                        )}
                        style={{ marginLeft: 8, padding: 4 }}
                    >
                        <Text style={{ fontSize: 22, color: '#1e90ff' }}>ℹ️</Text>
                    </TouchableOpacity>
                </View>

                {renderSelectorSize()}

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[
                        estilos.titulo,
                        { color: '#1e90ff', fontSize: estilos.titulo.fontSize * 1.08, marginBottom: 0 }
                    ]}>
                        ⚙️ Otras opciones
                    </Text>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="Información sobre otras opciones"
                        onPress={() => Alert.alert(
                            'Otras opciones',
                            'Puedes cambiar tu nombre, eliminar tu perfil de medicación o reiniciar desde el principio la aplicación.'
                        )}
                        style={{ marginLeft: 8, padding: 4 }}
                    >
                        <Text style={{ fontSize: 22, color: '#1e90ff' }}>ℹ️</Text>
                    </TouchableOpacity>
                </View>

                <BotonGrande
                    title="✏️ Cambiar el nombre en la aplicación"
                    onPress={handleChangeName}
                    style={[estilos.botonGrande, { backgroundColor: '#1e90ff' }]}
                />

                <BotonGrande
                    title="🗑️ Eliminar todos los medicamentos del botiquín"
                    onPress={handleClearMedicationProfile}
                    style={[estilos.botonGrande, { backgroundColor: '#1e90ff' }]}
                />

                <BotonGrande
                    title="♻️ Borrar todos los datos de la aplicación"
                    onPress={handleResetApp}
                    style={[
                        estilos.botonGrande,
                        { backgroundColor: '#ff5555', marginBottom: 10 }
                    ]}
                    textStyle={{
                        color: '#fff',
                        fontWeight: 'bold'
                    }}
                />
                <Text style={{
                    color: '#ff5555',
                    fontSize: estilos.texto.fontSize * 0.98,
                    textAlign: 'center',
                    marginBottom: 10
                }}>
                    Si se pulsa esta opción, se borrarán todos los datos y se volverá a la pantalla de inicio.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
