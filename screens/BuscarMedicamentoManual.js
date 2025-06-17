// src/screen/BuscarMedicamentoManual.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Keyboard,
    Alert,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppThemeContext';
import { getEstilosApp } from '../styles/estilosApp';
import { buscarMedicamentoManual } from '../utils/cimaAutocomplete';

const screenWidth = Dimensions.get('window').width;

export default function BuscarMedicamentoManual({ navigation }) {
    const { sizeOption } = useAppTheme();
    const estilos = getEstilosApp(sizeOption);

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);

    const handleBuscar = async () => {
        Keyboard.dismiss();
        setSeleccionado(null);
        if (!query.trim()) {
            Alert.alert('Introduce un nombre, CN o código.');
            return;
        }
        setLoading(true);
        setResultados([]);
        try {
            const data = await buscarMedicamentoManual(query.trim());
            setResultados(data || []);
            if (!data || data.length === 0) {
                Alert.alert('No encontrado', 'No se han encontrado medicamentos para tu búsqueda.');
            }
        } catch (e) {
            Alert.alert('Error', 'No se pudo realizar la búsqueda.');
        }
        setLoading(false);
    };

    const handleAñadir = () => {
        if (!seleccionado) return;
        navigation.navigate({
            name: 'AgregarMedicamento',
            params: { medicamentoManual: seleccionado },
            merge: true,
        });
    };

    // Solo muestra la previsualización y botones cuando hay seleccionado
    if (seleccionado) {
        return (
            <View style={[estilos.container, { paddingTop: 36, flex: 1, alignItems: 'center', justifyContent: 'flex-start' }]}>
                <Text style={estilos.titulo}>Previsualización</Text>
                <View style={{ alignItems: 'center', marginVertical: 14 }}>
                    {seleccionado.fotoCIMA ? (
                        <Image
                            source={{ uri: seleccionado.fotoCIMA }}
                            style={{
                                width: screenWidth * 0.5,
                                height: screenWidth * 0.5,
                                borderRadius: 18,
                                marginBottom: 12,
                                backgroundColor: '#f2f2f2',
                                borderWidth: 1,
                                borderColor: '#e1e8ee'
                            }}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={{
                            width: screenWidth * 0.5,
                            height: screenWidth * 0.5,
                            borderRadius: 18,
                            backgroundColor: '#f0f0f0',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12
                        }}>
                            <Ionicons name="image" size={60} color="#bbb" />
                            <Text style={[estilos.detalle, { marginTop: 10 }]}>Sin foto</Text>
                        </View>
                    )}
                    <Text style={estilos.nombre}>{seleccionado.nombre}</Text>
                    {seleccionado.tamanioPresentacion && <Text style={estilos.detalle}>Tamaño: {seleccionado.tamanioPresentacion}</Text>}
                    {seleccionado.ean && <Text style={estilos.detalle}>EAN: {seleccionado.ean}</Text>}
                    {seleccionado.cn && <Text style={estilos.detalle}>CN: {seleccionado.cn}</Text>}
                    {seleccionado.laboratorio && <Text style={estilos.extra}>Laboratorio: {seleccionado.laboratorio}</Text>}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, width: '100%' }}>
                    <TouchableOpacity
                        style={[
                            estilos.botonGrande,
                            { backgroundColor: '#27ae60', flex: 1, marginRight: 8 }
                        ]}
                        onPress={handleAñadir}
                    >
                        <Ionicons name="add-circle" size={estilos.textoBotonGrande.fontSize + 4} color="#fff" />
                        <Text style={estilos.textoBotonGrande}>Añadir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            estilos.botonGrande,
                            { backgroundColor: '#e74c3c', flex: 1, marginLeft: 8 }
                        ]}
                        onPress={() => setSeleccionado(null)}
                    >
                        <Ionicons name="arrow-back" size={estilos.textoBotonGrande.fontSize + 4} color="#fff" />
                        <Text style={estilos.textoBotonGrande}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Muestra la búsqueda y la lista si no hay seleccionado
    return (
        <View style={[estilos.container, { paddingTop: 36, flex: 1 }]}>
            <Text style={estilos.titulo}>Buscar medicamento manualmente</Text>
            <TextInput
                style={estilos.input}
                placeholder="Nombre, CN o código"
                placeholderTextColor="#aaa"
                value={query}
                onChangeText={setQuery}
                autoFocus
                onSubmitEditing={handleBuscar}
                returnKeyType="search"
            />
            <TouchableOpacity
                style={estilos.botonGrande}
                onPress={handleBuscar}
            >
                <Ionicons name="search" size={estilos.textoBotonGrande.fontSize + 6} color="#fff" />
                <Text style={estilos.textoBotonGrande}>Buscar</Text>
            </TouchableOpacity>

            {loading && (
                <ActivityIndicator size="large" color="#1e90ff" style={{ marginVertical: 18 }} />
            )}

            <FlatList
                data={resultados}
                keyExtractor={(item, i) =>
                    (item.ean ? item.ean.toString() : '') +
                    (item.cn ? `_${item.cn}` : '') +
                    (item.codigo ? `_${item.codigo}` : '') +
                    `_${i}`
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            estilos.card,
                            {
                                marginVertical: 10,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }
                        ]}
                        onPress={() => setSeleccionado(item)}
                    >
                        {item.fotoCIMA ? (
                            <Image
                                source={{ uri: item.fotoCIMA }}
                                style={{ width: 54, height: 54, borderRadius: 12, marginRight: 14, backgroundColor: '#f2f2f2' }}
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="image" size={48} color="#bbb" style={{ marginRight: 14 }} />
                        )}
                        <View style={{ flex: 1 }}>
                            <Text style={estilos.nombre}>{item.nombre}</Text>
                            {item.tamanioPresentacion && <Text style={estilos.detalle}>Tamaño: {item.tamanioPresentacion}</Text>}
                            {item.ean && <Text style={estilos.detalle}>EAN: {item.ean}</Text>}
                            {item.cn && <Text style={estilos.detalle}>CN: {item.cn}</Text>}
                            {item.laboratorio && <Text style={estilos.extra}>Laboratorio: {item.laboratorio}</Text>}
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={!loading ? (
                    <Text style={estilos.emptyText}>Introduce un término y pulsa buscar</Text>
                ) : null}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 16, alignItems: 'center' }}
            />

            <TouchableOpacity
                style={[estilos.botonGrande, { marginTop: 22, backgroundColor: '#e74c3c', width: '100%' }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={estilos.textoBotonGrande.fontSize + 4} color="#fff" />
                <Text style={estilos.textoBotonGrande}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
}
