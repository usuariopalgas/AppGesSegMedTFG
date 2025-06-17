// components/FondoDecorativo.js
import React from 'react';
import { Image } from 'react-native';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

export default function FondoDecorativo() {
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);
    return (
        <Image
            source={require('../assets/LogoAPP.png')}
            style={estilos.fondoDecorativo}
            resizeMode="contain"
            blurRadius={3}
        />
    );
}
