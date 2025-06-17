// src/screen/ListaMedicamentosScreen.js
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMedicamentos } from '../services/storage';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp, SIZE_OPTIONS } from '../styles/estilosApp';

export default function ListaMedicamentosScreen({ navigation }) {
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const [medicamentos, setMedicamentos] = useState([]);
    const [modoArmario, setModoArmario] = useState(false);
    const fontSize = SIZE_OPTIONS[sizeOption]?.fuente || 18;

    const cargarDatos = async () => {
        try {
            const lista = await getMedicamentos();
            setMedicamentos(lista);
        } catch (error) {
            console.error('Error al cargar medicamentos:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarDatos();
        }, [])
    );

    const renderFoto = (item, style) => {
        if (item.photoUri) {
            return <Image source={{ uri: item.photoUri }} style={style} />;
        }
        if (item.fotoCIMA) {
            return <Image source={{ uri: item.fotoCIMA }} style={style} />;
        }
        return <Ionicons name="image" size={style.width || 60} color="#bbb" style={style} />;
    };

    const FotoBadge = ({ item }) => (
        (item.photoUri || item.fotoCIMA) ? (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginTop: 2,
                marginBottom: 2,
                backgroundColor: '#e7f1fa',
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 2,
            }}>
                <Ionicons name="image" size={18} color="#1e90ff" />
                <Text style={{ color: '#1e90ff', fontSize: fontSize * 0.97, marginLeft: 4 }}>Foto</Text>
            </View>
        ) : null
    );

    const AudioBadge = ({ item }) => (
        item.audioURI ? (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginTop: 2,
                backgroundColor: '#e6fadc',
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginLeft: 6
            }}>
                <Ionicons name="mic" size={17} color="#27ae60" />
                <Text style={{ color: '#27ae60', fontSize: fontSize * 0.97, marginLeft: 4 }}>Nota de voz</Text>
            </View>
        ) : null
    );

    // LISTA
    const renderItemLista = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('DetalleMedicamento', { id: item.id })}>
            <View style={estilos.item}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderFoto(item, { width: 90, height: 90, borderRadius: 18, backgroundColor: '#f2f2f2' })}
                    <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                            <Text style={estilos.nombre}>{item.nombre}</Text>
                            {/* Solo modo lista: Badge foto */}
                            {(item.photoUri || item.fotoCIMA) && (
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignSelf: 'flex-start',
                                    marginLeft: 8,
                                    backgroundColor: '#e7f1fa',
                                    borderRadius: 8,
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                }}>
                                    <Ionicons name="image" size={18} color="#1e90ff" />
                                    <Text style={{ color: '#1e90ff', fontSize: fontSize * 0.97, marginLeft: 4 }}>Foto</Text>
                                </View>
                            )}
                            {/* Badge de audio */}
                            {item.audioURI && (
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignSelf: 'flex-start',
                                    marginLeft: 8,
                                    backgroundColor: '#e6fadc',
                                    borderRadius: 8,
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                }}>
                                    <Ionicons name="mic" size={17} color="#27ae60" />
                                    <Text style={{ color: '#27ae60', fontSize: fontSize * 0.97, marginLeft: 4 }}>Nota de voz</Text>
                                </View>
                            )}
                        </View>
                        {/* Forma farmacéutica en lista */}
                        {item.formaFarmaceutica
                            ? <Text style={estilos.extra}>{item.formaFarmaceutica}</Text>
                            : <Text style={estilos.extra}>—</Text>
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // ARMARIO/GRID
    const renderItemGrid = ({ item }) => (
        <TouchableOpacity
            style={estilos.cardGrid}
            onPress={() => navigation.navigate('DetalleMedicamento', { id: item.id })}
        >
            {renderFoto(item, estilos.imagenGrid)}
            <Text style={estilos.tituloGrid} numberOfLines={2}>{item.nombre}</Text>
            {/* Badge de audio solo, si existe */}
            {item.audioURI && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: '#e6fadc',
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    marginTop: 2,
                    marginBottom: 6,
                }}>
                    <Ionicons name="mic" size={17} color="#27ae60" />
                    <Text style={{ color: '#27ae60', fontSize: fontSize * 0.97, marginLeft: 4 }}>Nota de voz</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={estilos.container} edges={['top', 'left', 'right']}>
            <View style={estilos.topBar}>
                <Text style={estilos.titulo}>📋 Medicamentos</Text>
                <TouchableOpacity
                    style={estilos.toggleBtn}
                    onPress={() => setModoArmario(m => !m)}
                >
                    <Ionicons name={modoArmario ? 'list' : 'grid'} size={26} color="#1e90ff" />
                    <Text style={{ marginLeft: 6, color: '#1e90ff', fontSize }}>
                        {modoArmario ? 'Vista lista' : 'Vista armario'}
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={medicamentos}
                keyExtractor={item => item.id}
                renderItem={modoArmario ? renderItemGrid : renderItemLista}
                numColumns={modoArmario ? 2 : 1}
                key={modoArmario ? 'grid' : 'list'}
                contentContainerStyle={modoArmario ? estilos.gridContainer : undefined}
                columnWrapperStyle={modoArmario ? { justifyContent: 'space-between' } : undefined}
                ListEmptyComponent={
                    <Text style={estilos.emptyText}>No hay medicamentos guardados.</Text>
                }
            />

            <TouchableOpacity
                style={estilos.fab}
                onPress={() => navigation.navigate('AgregarMedicamento')}
            >
                <Ionicons name="add-circle" size={64} color="#1e90ff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
