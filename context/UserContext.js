// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [name, setName] = useState(null);
    const [bienvenidaCompleted, setBienvenidaCompleted] = useState(false);

    useEffect(() => {
        (async () => {
            const storedName = await AsyncStorage.getItem('userName');
            const storedDone = await AsyncStorage.getItem('bienvenidaCompletada');
            if (storedName) setName(storedName);
            if (storedDone === 'true') setBienvenidaCompleted(true);
        })();
    }, []);

    const saveName = async newName => {
        await AsyncStorage.setItem('userName', newName);
        setName(newName);
    };

    const completeWelcome = async () => {
        await AsyncStorage.setItem('bienvenidaCompletada', 'true');
        setBienvenidaCompleted(true);
    };

    const clearName = async () => {
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.removeItem('bienvenidaCompletada');
        await AsyncStorage.removeItem('preferencias');
        setName(null);
        setBienvenidaCompleted(false);
    };

    return (
        <UserContext.Provider value={{
            name,
            saveName,
            clearName,
            bienvenidaCompleted,
            completeWelcome
        }}>
            {children}
        </UserContext.Provider>
    );
}
