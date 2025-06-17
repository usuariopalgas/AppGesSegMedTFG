// src/navigation/AppNavigator.js
import React, { useEffect, useState, useContext } from 'react';
import LoadingScreen from '../screens/LoadingScreen';
import WelcomeStack from './WelcomeStack';
import MainTabs from './MainTabs';
import { UserContext } from '../context/UserContext';


export default function AppNavigator() {
    const { name, bienvenidaCompleted } = useContext(UserContext);
    const [status, setStatus] = useState('loading'); // loading | welcome | main

    useEffect(() => {
        if (name == null) {
            setStatus('welcome');
        } else if (!bienvenidaCompleted) {
            setStatus('welcome');
        } else {
            setStatus('main');
        }
    }, [name, bienvenidaCompleted]);

    if (status === 'loading') return <LoadingScreen />;
    if (status === 'welcome') return <WelcomeStack />;
  /* main: */                return <MainTabs />;
}
