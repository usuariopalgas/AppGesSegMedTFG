// App.js
/**
 * Aplicación Móvil Híbrida para la Gestión y Seguimiento de la Medicación en Personas Mayores: Innovación en Accesibilidad, Soporte Multimedia y Uso de Datos Públicos
 * Autor: M Pilar Algás Alba
 * TFG - Universidad UNIR, 2025
 */
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './context/UserContext';
import { AppThemeProvider } from './context/AppThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { LogBox } from 'react-native';

//Esta aplicación móvil utiliza push notifications en local.
LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
    '`expo-notifications` functionality is not fully supported in Expo Go',
]);

//activación de notificaciones
/*
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});*/

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    useEffect(() => {
        //Se solicitan permisos de notificaciones solo la primera vez
        Notifications.requestPermissionsAsync();
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#1e90ff',
                sound: true,
            });
        }
    }, []);

    return (
        <SafeAreaProvider>
            <AppThemeProvider>
                <UserProvider>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </UserProvider>
            </AppThemeProvider>
        </SafeAreaProvider>
    );
}
