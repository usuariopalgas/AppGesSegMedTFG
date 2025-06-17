// src/styles/estilosApp.js

import { StyleSheet, Platform } from 'react-native';
import { Image } from 'react-native';

export const SIZE_OPTIONS = {
    normal: { fuente: 16, titulo: 22, boton: 18, icono: 22, altoBoton: 48 },
    grande: { fuente: 20, titulo: 26, boton: 22, icono: 28, altoBoton: 58 },
    muygrande: { fuente: 24, titulo: 32, boton: 26, icono: 34, altoBoton: 68 },
};

export function FondoDecorativo() {
    return (
        <Image
            source={require('../assets/LogoAPP.png')}
            style={getEstilosApp().fondoDecorativo}
            resizeMode="contain"
            blurRadius={3}
        />
    );
}

export function getEstilosApp(sizeOption) {
    const t = SIZE_OPTIONS[sizeOption] || SIZE_OPTIONS.grande;

    const styles = StyleSheet.create({
        // Container general
        container: {
            flex: 1,
            backgroundColor: '#f8fafd',
            padding: 22,
            paddingBottom: 12,
        },
        scrollContent: {
            alignItems: 'center',
            padding: 22,
            paddingBottom: 32,
        },

        card: {
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: 28,
            padding: 20,
            alignItems: 'center',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOpacity: 0.07,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 3 },
            elevation: 4,
        },
        titulo: {
            fontSize: t.titulo,
            fontWeight: 'bold',
            marginBottom: 14,
            color: '#1e90ff',
            textAlign: 'center',
        },
        texto: {
            fontSize: t.fuente,
            color: '#222',
            marginBottom: 8,
            textAlign: 'center',
        },

        fotoGrande: {
            width: 180,
            height: 180,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: '#e1e8ee',
            marginBottom: 12,
            backgroundColor: '#f2f2f2',
        },
        fotoPlaceholder: {
            width: 180,
            height: 180,
            borderRadius: 22,
            backgroundColor: '#f0f0f0',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
        },

        botonGrande: {
            backgroundColor: '#1e90ff',
            borderRadius: 12,
            minHeight: t.altoBoton * 1.15,
            minWidth: 160,
            width: '95%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 40,
        },

        textoBotonGrande: {
            fontSize: t.boton,
            color: '#fff',
            fontWeight: 'bold',
        },
        botonSecundario: {
            backgroundColor: '#e74c3c',
            borderRadius: 12,
            minHeight: t.altoBoton * 0.9,
            minWidth: 160,
            width: '70%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 36,
        },

        prospectoLink: {
            color: '#1e90ff',
            fontWeight: 'bold',
            fontSize: t.boton,
            marginTop: 16,
            marginBottom: 12,
            textAlign: 'center',
            textDecorationLine: 'underline',
        },

        input: {
            borderWidth: 1,
            borderColor: '#e1e8ee',
            borderRadius: 8,
            padding: 18,
            fontSize: t.fuente,
            backgroundColor: '#f7faff',
            marginBottom: 16,
            width: '100%',
            color: '#222',
        },

        item: {
            padding: 16,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 16,
            marginBottom: 16,
            backgroundColor: '#fff',
            marginHorizontal: 4,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 7,
            elevation: 2,
        },
        fotoLista: {
            width: 90,
            height: 90,
            borderRadius: 18,
            backgroundColor: '#f2f2f2',
            borderWidth: 1,
            borderColor: '#e1e8ee',
        },
        nombre: {
            fontSize: t.titulo * 0.97,
            fontWeight: 'bold',
            marginBottom: 2,
            color: '#1e90ff',
        },
        detalle: {
            fontSize: t.fuente,
            color: '#444',
            marginBottom: 2,
        },
        extra: {
            fontSize: t.fuente * 0.97,
            color: '#258',
            marginBottom: 2,
            fontWeight: '500',
        },
        emptyText: {
            textAlign: 'center',
            color: '#aaa',
            marginTop: 48,
            fontSize: t.fuente * 1.1,
        },

        gridContainer: {
            paddingHorizontal: 12,
            paddingTop: 18,
            paddingBottom: 100,
        },
        cardGrid: {
            flex: 1,
            margin: 7,
            minWidth: 160,
            maxWidth: '48%',
            backgroundColor: '#fff',
            borderRadius: 18,
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOpacity: 0.10,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 5 },
            minHeight: 210,
            justifyContent: 'space-between',
            borderBottomWidth: 7,
            borderBottomColor: '#e6eef8',
            marginBottom: 14,
            borderTopWidth: 1.5,
            borderTopColor: '#d0dae6',
        },
        imagenGrid: {
            width: 96,
            height: 96,
            borderRadius: 17,
            backgroundColor: '#f2f2f2',
            marginBottom: 8,
            borderWidth: 1,
            borderColor: '#e1e8ee',
        },
        tituloGrid: {
            fontSize: t.titulo * 0.88,
            fontWeight: 'bold',
            color: '#1e90ff',
            marginBottom: 6,
            marginTop: 0,
            textAlign: 'center',
        },
        extraGrid: {
            fontSize: t.fuente * 0.97,
            color: '#258',
            marginBottom: 3,
            textAlign: 'center',
            fontWeight: '500',
        },

        fab: {
            position: 'absolute',
            right: 20,
            bottom: Platform.OS === 'ios' ? 40 : 20,
            zIndex: 50,
        },

        topBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 12,
        },
        toggleBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 24,
            backgroundColor: '#eef6fc',
            borderWidth: 1,
            borderColor: '#cbe8fd',
            marginLeft: 10,
        },
        fondoDecorativo: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.13,
            zIndex: 0,
        },

        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 22,
            marginBottom: 12,

        },
        headerTitle: {
            fontSize: t.titulo,
            fontWeight: 'bold',
            color: '#1e90ff',
            textAlign: 'left',
            marginBottom: 12,
            paddingVertical: 20,

        },
        headerSide: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerBtn: {
            padding: Math.round(t.icono * 0.25),
            borderRadius: Math.round(t.icono * 0.35),
            marginLeft: 8,
        },

        msgContainer: {
            marginVertical: 4,
            marginHorizontal: 10,
            padding: 10,
            borderRadius: 8,
            maxWidth: '80%',
        },
        user: {
            alignSelf: 'flex-end',
            backgroundColor: '#1e90ff',
        },
        bot: {
            alignSelf: 'flex-start',
            backgroundColor: '#e6f2ff',
        },
        msgText: {
            color: '#000',
            fontSize: t.fuente,
        },
        chatinput: {
            flex: 1,
            height: t.altoBoton,
            borderWidth: 1,
            borderColor: '#e1e8ee',
            borderRadius: 8,
            paddingVertical: Math.round(t.fuente * 0.5),
            paddingHorizontal: 12,
            fontSize: t.fuente,
            backgroundColor: '#f7faff',
            marginBottom: 16,
            color: '#222',
        },

        qrContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 8,
        },
        qrButton: {
            paddingVertical: Math.round(t.fuente * 0.5),
            paddingHorizontal: 12,
            margin: 4,
            borderRadius: 16,
            minHeight: t.altoBoton * 0.7,
            justifyContent: 'center',
        },
        qrText: {
            fontSize: t.fuente,
            color: '#fff',
        },

        inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: '#e1e8ee',
            borderRadius: 8,
            padding: 18,
            fontSize: t.fuente,
            backgroundColor: '#f7faff',
            marginBottom: 16,
            width: '100%',
            color: '#222',
        },
        sendBtn: {
            borderRadius: t.altoBoton / 2,
            marginHorizontal: 4,
            minWidth: t.altoBoton,
            minHeight: t.altoBoton,
            alignItems: 'center',
            justifyContent: 'center',
        },
        micBtn: {
            borderRadius: t.altoBoton / 2,
            marginHorizontal: 4,
            minWidth: t.altoBoton,
            minHeight: t.altoBoton,
            alignItems: 'center',
            justifyContent: 'center',
        },

        tomaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 16,
            marginBottom: 10,
            padding: 14,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            marginHorizontal: 6,
        },
        tomaMedicamento: {
            fontWeight: 'bold',
            marginBottom: 2,
            textAlign: 'left',
            fontSize: t.fuente,
            color: '#222'
        },
        tomaHora: {
            color: '#1e90ff',
            textAlign: 'left',
            fontSize: t.fuente * 1.15,
            fontWeight: 'bold',
        },
        tomaBtn: {
            borderRadius: 10,
            padding: 12,
            marginLeft: 2,
            marginRight: 2,
            backgroundColor: '#eee',
            alignItems: 'center',
            justifyContent: 'center',
        },
        tomaBtnTomado: {
            backgroundColor: '#27ae60', // verde
        },
        tomaBtnOmitido: {
            backgroundColor: '#e67e22', // naranja/rojo
        },
        tomaIcono: {
            fontSize: t.icono * 1.25,
        },
        tomaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 16,
            marginBottom: 10,
            padding: 14,
            marginHorizontal: 6,
            backgroundColor: '#fff',
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
        },
        tomaRowTomado: {
            backgroundColor: '#d4f8df', // verde muy claro
        },
        tomaRowOmitido: {
            backgroundColor: '#fde7d4', // naranja claro
        },


        resumenSemana: {
            marginTop: 20,
            marginBottom: 10,
            alignSelf: 'center',
            backgroundColor: '#eef6fc',
            borderRadius: 18,
            padding: 14,
            minWidth: 180,
        },
        resumenTomasDia: {
            marginTop: 18,
            alignSelf: 'center',
            backgroundColor: '#eef6fc',
            borderRadius: 18,
            padding: 14,
            minWidth: 180,
            marginBottom: 16,
        },
        textoResumenTomasDia: {
            textAlign: 'center',
            color: '#258',
            fontWeight: 'bold',
            fontSize: t.titulo * 0.9,
        },

        textoDescripcionBoton: {
            fontSize: t.titulo * 1.5,
            marginTop: 4,
            color: '#fff',                // Blanco puro para máximo contraste en fondo azul
            fontWeight: '600',
            opacity: 1,
            textAlign: 'left'
        },
        textoDescripcionBotonSecundario: {
            fontSize: t.titulo * 0.80,
            marginTop: 4,
            color: '#fff',
            fontWeight: '500',
            opacity: 1,
            textAlign: 'left'
        },
        botonOpcionHorizontal: {
            backgroundColor: '#fff',
            borderRadius: 12,
            minWidth: 0,
            paddingVertical: 14,
            paddingHorizontal: 22,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 6,
            borderWidth: 2,
            borderColor: '#e1e8ee'
        },
        botonOpcionHorizontalActivo: {
            backgroundColor: '#1e90ff',
            borderColor: '#1e90ff',
        },
        textoOpcionHorizontal: {
            color: '#1e90ff',
            fontWeight: 'bold',
            fontSize: t.boton,
        },
        textoOpcionHorizontalActivo: {
            color: '#fff',
        },
        botonControlPequeño: {
            backgroundColor: '#eee',
            borderRadius: 28,
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 6,
            borderWidth: 1,
            borderColor: '#d0dae6',
        },
        textoBotonControlPequeño: {
            fontSize: t.boton * 2,
            color: '#1e90ff',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        textoHoraGrande: {
            fontSize: t.titulo * 1.1,
            color: '#1e90ff',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        textoFechaGrande: {
            fontSize: t.titulo * 1.05,
            color: '#1e90ff',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        tituloToma: {
            fontSize: t.titulo * 0.95,
            color: '#258',
            fontWeight: 'bold',
            marginBottom: 8,
            marginTop: 10,
        },
        bloqueToma: {
            backgroundColor: '#f8fafd',
            borderRadius: 18,
            paddingVertical: 12,
            paddingHorizontal: 8,
            marginBottom: 22,
            marginTop: 6,
            shadowColor: '#000',
            shadowOpacity: 0.03,
            shadowRadius: 4,
            elevation: 2,
        },
        iasSemanaContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 20,
            marginTop: 6,
        },
        diaSemanaBtn: {
            backgroundColor: '#fff',
            paddingHorizontal: 22,
            paddingVertical: 13,
            borderRadius: 18,
            borderWidth: 1.5,
            borderColor: '#ccc',
            marginRight: 8,
            marginBottom: 8,
            alignItems: 'center',
            minWidth: 54
        },
        diaSemanaBtnActivo: {
            backgroundColor: '#1e90ff',
            borderColor: '#1e90ff',
        },
        diaSemanaTexto: {
            color: '#1e90ff',
            fontWeight: 'bold',
            fontSize: t.fuente * 1.15,
            letterSpacing: 1,
        },
        diaSemanaTextoActivo: {
            color: '#fff',
        },
        textoDescripcionAyuda: {
            fontSize: t.fuente * 1.1,
            color: '#333',
            opacity: 0.93,
            marginBottom: 32,
            marginLeft: 6,
            marginRight: 6,
            textAlign: 'left',
            lineHeight: t.fuente * 1.5,
        },
        nombreMedicamento: {
            fontSize: t.titulo * 0.9,
            color: '#777',
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            letterSpacing: 0.2,
        },
        resumenTomasDia: {
            marginTop: 18,
            alignSelf: 'center',
            backgroundColor: '#eef6fc',
            borderRadius: 18,
            padding: 14,
            minWidth: 180,
            marginBottom: 16,
        },
        textoResumenTomasDia: {
            textAlign: 'center',
            color: '#258',
            fontWeight: 'bold',
            fontSize: t.titulo * 0.9,
        },

    });

    // valores numéricos y colores accesibles desde JS
    styles.colorPrimario = '#1e90ff';
    styles.colorPeligro = '#e74c3c';
    styles.icono = t.icono;
    styles.fuente = t.fuente;
    styles.altoBoton = t.altoBoton;

    return styles;
}
