// src/navigation/BotiquinStackScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaMedicamentosScreen from '../screens/ListaMedicamentosScreen';
import AgregarMedicamentoScreen from '../screens/AgregarMedicamentoScreen';
import EditarMedicamentoScreen from '../screens/EditarMedicamentoScreen';
import DetalleMedicamentoScreen from '../screens/DetalleMedicamentoScreen';
import EscanerScreen from '../screens/EscanerScreen';
import BuscarMedicamentoManual from '../screens/BuscarMedicamentoManual';
import SeleccionarFrecuenciaScreen from '../screens/SeleccionarFrecuenciaScreen';
import ElegirHorariosScreen from '../screens/ElegirHorariosScreen';
import SeleccionarVecesAlDiaScreen from '../screens/SeleccionarVecesAlDiaScreen';
import DiasEspecificosSemanaScreen from '../screens/DiasEspecificosSemanaScreen';
import IntervaloScreen from '../screens/IntervaloScreen';
import FrecuenciaDiasSemanaScreen from '../screens/FrecuenciaDiasSemanaScreen';
import CiclicoScreen from '../screens/CiclicoScreen';


const Stack = createNativeStackNavigator();

export default function BotiquinStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ListaMedicamentos"
                component={ListaMedicamentosScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AgregarMedicamento"
                component={AgregarMedicamentoScreen}
                options={{ title: 'Añadir medicamento' }}
            />
            <Stack.Screen
                name="EditarMedicamento"
                component={EditarMedicamentoScreen}
                options={{ title: 'Editar medicamento' }}
            />
            <Stack.Screen
                name="DetalleMedicamento"
                component={DetalleMedicamentoScreen}
                options={{ title: 'Detalle medicamento' }}
            />
            <Stack.Screen
                name="Escaner"
                component={EscanerScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BuscarMedicamentoManual"
                component={BuscarMedicamentoManual}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SeleccionarFrecuencia"
                component={SeleccionarFrecuenciaScreen}
                options={{ title: 'Opciones de tomas' }}
            />
            <Stack.Screen
                name="ElegirHorarios"
                component={ElegirHorariosScreen}
                options={{ title: 'Horario de toma' }}
            />
            <Stack.Screen
                name="SeleccionarVecesAlDia"
                component={SeleccionarVecesAlDiaScreen}
                options={{ title: 'Opciones al día' }}
            />

            <Stack.Screen
                name="DiasEspecificosSemana"
                component={DiasEspecificosSemanaScreen}
                options={{ title: 'Más opciones de frecuencia' }}
            />
            <Stack.Screen
                name="IntervaloScreen"
                component={IntervaloScreen}
                options={{ title: 'Opciones de intervalo' }}
            />
            <Stack.Screen
                name="FrecuenciaDiasSemana"
                component={FrecuenciaDiasSemanaScreen}
                options={{ title: 'Opciones de frecuencia semana' }}
            />
            <Stack.Screen
                name="CiclicoScreen"
                component={CiclicoScreen}
                options={{ title: 'Opciones modo cíclico' }}
            />


        </Stack.Navigator>
    );
}
