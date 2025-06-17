// src/navigation/TomasStackScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TomasScreen from '../screens/TomasScreen';


const Stack = createNativeStackNavigator();

export default function TomasStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="TomasScreen"
                component={TomasScreen}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    );
}
