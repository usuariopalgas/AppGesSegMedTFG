import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatStackScreen from './ChatStackScreen';
import TomasStackScreen from './TomasStackScreen';
import BotiquinStackScreen from './BotiquinStackScreen';
import MasStackScreen from './MasStackScreen';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { SIZE_OPTIONS } from '../styles/estilosApp';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    const { sizeOption } = useAppTheme();
    const iconSize = SIZE_OPTIONS[sizeOption]?.icono ?? 28;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({

                tabBarIcon: ({ color }) => {
                    const icons = {
                        "Cuéntame": 'chatbubbles-outline',
                        "Tomas": 'calendar-outline',
                        "Botiquin": 'cube',
                        "Mas": 'ellipsis-horizontal-outline',
                    };
                    return <Ionicons name={icons[route.name]} size={iconSize} color={color} />;
                },
                tabBarActiveTintColor: '#1e90ff',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: iconSize * 0.7, fontWeight: 'bold' },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Cuéntame" component={ChatStackScreen} />
            <Tab.Screen name="Tomas" component={TomasStackScreen} />
            <Tab.Screen name="Botiquin" component={BotiquinStackScreen} />
            <Tab.Screen name="Mas" component={MasStackScreen} />
        </Tab.Navigator>
    );
}
