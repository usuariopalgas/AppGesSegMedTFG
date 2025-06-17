// src/context/AppThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIZE_OPTIONS = ['normal', 'grande', 'muygrande'];

export const AppThemeContext = createContext({
    sizeOption: 'grande',
    setSizeOption: () => { },
});

export function AppThemeProvider({ children }) {
    const [sizeOption, setSizeOptionState] = useState('grande');

    useEffect(() => {
        AsyncStorage.getItem('preferenciaSizeOption').then(val => {
            if (val && SIZE_OPTIONS.includes(val)) setSizeOptionState(val);
        });
    }, []);

    const setSizeOption = async (nuevo) => {
        setSizeOptionState(nuevo);
        await AsyncStorage.setItem('preferenciaSizeOption', nuevo);
    };

    return (
        <AppThemeContext.Provider value={{ sizeOption, setSizeOption }}>
            {children}
        </AppThemeContext.Provider>
    );
}

export function useAppTheme() {
    return useContext(AppThemeContext);
}
