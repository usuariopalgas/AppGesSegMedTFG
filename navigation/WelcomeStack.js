// src/navigation/WelcomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BienvenidaInicial from '../screens/BienvenidaInicialScreen';
import BienvenidaNombre from '../screens/BienvenidaNombreScreen';
import BienvenidaPreferencias from '../screens/BienvenidaPreferenciasScreen';

const Stack = createNativeStackNavigator();

export default function WelcomeStack({ onComplete }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BienvenidaInicial" component={BienvenidaInicial} />
            <Stack.Screen name="BienvenidaNombre">
                {props => <BienvenidaNombre {...props} onNext={() => props.navigation.navigate('BienvenidaPreferencias')} saveName={props.route.params?.saveName} />}
            </Stack.Screen>
            <Stack.Screen name="BienvenidaPreferencias">
                {props => <BienvenidaPreferencias {...props} onFinish={onComplete} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}