import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';

export default function BotonGrande({
    title,
    onPress,
    style,
    textStyle,
    icon,        // nombre Ionicons, por ejemplo: "checkmark-circle"
    iconColor,   // color del icono, por defecto "#fff"
    disabled = false,
    ...rest
}) {
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    return (
        <TouchableOpacity
            style={[
                estilos.botonGrande,
                style,
                disabled && { opacity: 0.6 }
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel={title}
            disabled={disabled}
            {...rest}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {icon ? (
                    <Ionicons
                        name={icon}
                        size={estilos.textoBotonGrande.fontSize + 8}
                        color={iconColor || "#fff"}
                        style={{ marginRight: 8 }}
                    />
                ) : null}
                <Text style={[estilos.textoBotonGrande, textStyle]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}
