// src/screen/TomasScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getEstilosApp, FondoDecorativo } from '../styles/estilosApp';
import { useAppTheme } from '../context/AppThemeContext';
import { getMedicamentos, updateMedicamento } from '../services/storage';

const WEEK_DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function TomasScreen() {
  const { sizeOption } = useAppTheme();
  const estilos = getEstilosApp(sizeOption);

  const [medicamentos, setMedicamentos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());

  // Cargar medicamentos desde storage
  useFocusEffect(
    React.useCallback(() => {
      const cargarMedicamentos = async () => {
        const meds = await getMedicamentos();
        setMedicamentos(meds);
      };
      cargarMedicamentos();
    }, [])
  );

  // Cambia de día con flechas
  const cambiarDia = delta => {
    const nuevaFecha = new Date(diaSeleccionado);
    nuevaFecha.setDate(diaSeleccionado.getDate() + delta);
    setDiaSeleccionado(nuevaFecha);
  };

  // Marcar una toma como "tomado" u "omitido" y guardar
  const marcarToma = async (medId, tomaIndex, nuevoEstado) => {
    const meds = await getMedicamentos();
    const medIndex = meds.findIndex(med => med.id === medId);
    if (medIndex === -1) return;
    const nuevasTomas = [...meds[medIndex].tomas];
    nuevasTomas[tomaIndex] = { ...nuevasTomas[tomaIndex], estado: nuevoEstado };
    meds[medIndex].tomas = nuevasTomas;
    await updateMedicamento(medId, { tomas: nuevasTomas });
    setMedicamentos(await getMedicamentos());
  };

  // Filtra las tomas del día seleccionado
  const diaISO = diaSeleccionado.toISOString().split('T')[0];
  const tomasDelDia = medicamentos.flatMap(med =>
    (med.tomas || [])
      .map((toma, idx) => ({
        ...toma,
        nombre: med.nombre,
        medId: med.id,
        tomaIndex: idx
      }))
      .filter(toma => String(toma.fecha) === diaISO)
  );

  // Resumen del día
  const totalTomasDia = tomasDelDia.length;
  const tomasTomadasDia = tomasDelDia.filter(t => t.estado === 'tomado').length;

  // Helpers
  const getFechaTexto = (fecha) =>
    `${WEEK_DAYS[fecha.getDay()]} ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

  const resetearToma = async (medId, tomaIndex) => {
    const meds = await getMedicamentos();
    const medIndex = meds.findIndex(med => med.id === medId);
    if (medIndex === -1) return;
    const nuevasTomas = [...meds[medIndex].tomas];
    nuevasTomas[tomaIndex] = { ...nuevasTomas[tomaIndex], estado: 'pendiente' };
    meds[medIndex].tomas = nuevasTomas;
    await updateMedicamento(medId, { tomas: nuevasTomas });
    setMedicamentos(await getMedicamentos());
  };

  return (
    <SafeAreaView style={estilos.container}>
      <FondoDecorativo />
      <View style={estilos.headerContainer}>
        <TouchableOpacity onPress={() => cambiarDia(-1)} style={estilos.headerBtn}>
          <Ionicons name="chevron-back" size={estilos.icono} color="#1e90ff" />
        </TouchableOpacity>
        <Text style={[estilos.headerTitle, { flex: 1, textAlign: 'center' }]}>
          {getFechaTexto(diaSeleccionado)}
        </Text>
        <TouchableOpacity onPress={() => cambiarDia(1)} style={estilos.headerBtn}>
          <Ionicons name="chevron-forward" size={estilos.icono} color="#1e90ff" />
        </TouchableOpacity>
      </View>
      <Text style={[estilos.texto, { marginBottom: 8, marginTop: 6 }]}>
        Revisa y marca tus medicinas de hoy.
      </Text>

      <FlatList
        data={tomasDelDia}
        keyExtractor={(item, idx) => item.medId + item.hora + idx}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => resetearToma(item.medId, item.tomaIndex)}
            activeOpacity={0.8}
            style={[
              estilos.tomaRow,
              item.estado === 'tomado' && estilos.tomaRowTomado,
              item.estado === 'omitido' && estilos.tomaRowOmitido,
            ]}
          >
            <Ionicons
              name={item.estado === 'tomado'
                ? 'checkmark-circle'
                : item.estado === 'omitido'
                  ? 'close-circle'
                  : 'ellipse-outline'}
              size={32}
              color={
                item.estado === 'tomado'
                  ? '#27ae60'
                  : item.estado === 'omitido'
                    ? '#e67e22'
                    : '#aaa'
              }
              style={{ marginRight: 14 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={estilos.tomaMedicamento}>
                {item.nombre}
              </Text>
              <Text style={estilos.tomaHora}>
                {item.hora}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => marcarToma(item.medId, item.tomaIndex, 'tomado')}
              style={[
                estilos.tomaBtn,
                item.estado === 'tomado' && estilos.tomaBtnTomado
              ]}>
              <Ionicons name="checkmark" size={28} color={item.estado === 'tomado' ? '#fff' : '#27ae60'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => marcarToma(item.medId, item.tomaIndex, 'omitido')}
              style={[
                estilos.tomaBtn,
                item.estado === 'omitido' && estilos.tomaBtnOmitido
              ]}>
              <Ionicons name="close" size={28} color={item.estado === 'omitido' ? '#fff' : '#e67e22'} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={[estilos.texto, { marginTop: 20 }]}>No hay tomas para este día.</Text>}
      />


      <View style={estilos.resumenTomasDia}>
        <Text style={estilos.textoResumenTomasDia}>
          Hoy: {tomasTomadasDia} de {totalTomasDia} tomas completadas
        </Text>
      </View>
    </SafeAreaView>
  );
}
