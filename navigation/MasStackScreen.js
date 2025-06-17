// src/navigation/MasStackScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MasScreen from '../screens/MasScreen';

const Stack = createNativeStackNavigator();

export default function MasStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MasScreen"
                component={MasScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
