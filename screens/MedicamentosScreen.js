// src/screen/MedicamentosScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotonGrande from '../components/BotonGrande';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FAB, Portal, Provider as PaperProvider } from 'react-native-paper';
import GrabadoraAudio from '../components/GrabadoraAudio';
import { Audio } from 'expo-av';
import { Button } from 'react-native';


export default function MedicamentosScreen({ navigation }) {
  const [medicamentos, setMedicamentos] = useState([]);
  const isFocused = useIsFocused();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarGrabadora, setMostrarGrabadora] = useState(false);
  const [notaDeVoz, setNotaDeVoz] = useState(null);
  const [reproduciendo, setReproduciendo] = useState(false);


  useEffect(() => {
    const cargarMedicamentos = async () => {
      try {
        const almacenados = await AsyncStorage.getItem('medicamentos');
        const lista = almacenados ? JSON.parse(almacenados) : [];
        setMedicamentos(lista);
      } catch (error) {
        console.error('Error al cargar medicamentos', error);
      }
    };
    if (isFocused) {
      cargarMedicamentos();
    }
  }, [isFocused]);

  const reproducirNota = async (uri) => {
    try {
      setReproduciendo(true);

      const { sound } = await Audio.Sound.createAsync({ uri });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setReproduciendo(false);
          sound.unloadAsync();
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error('Error al reproducir nota:', error);
      setReproduciendo(false);
    }
  };

  const eliminarMedicamento = (id) => {
    Alert.alert(
      '¿Eliminar medicamento?',
      'Esta acción no se puede deshacer',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const nuevosMedicamentos = medicamentos.filter((med) => med.id !== id);
              setMedicamentos(nuevosMedicamentos);
              await AsyncStorage.setItem('medicamentos', JSON.stringify(nuevosMedicamentos));
            } catch (error) {
              console.error('Error al eliminar medicamento:', error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.detalle}>Dosis: {item.dosis}</Text>
          <Text style={styles.detalle}>Frecuencia: {item.frecuencia}</Text>
        </View>
        <TouchableOpacity onPress={() => eliminarMedicamento(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tus Medicamentos</Text>

      {medicamentos.length === 0 ? (
        <Text style={styles.vacio}>No hay medicamentos guardados.</Text>
      ) : (
        <FlatList
          data={medicamentos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      {notaDeVoz && !reproduciendo && (
        <View style={{ marginVertical: 10 }}>
          <Button
            title="🔁 Repetir nota de voz"
            onPress={() => reproducirNota(notaDeVoz)}
          />
        </View>
      )}


      <View style={styles.botonera}>
        <BotonGrande
          title="Agregar Medicamento"
          onPress={() => navigation.navigate('AgregarMedicamento')}
        />
        <BotonGrande
          title="Ver medicamentos"
          onPress={() => navigation.navigate('ListaMedicamentos')}
        />
      </View>


      <Portal>
        <FAB.Group
          open={menuAbierto}
          icon={menuAbierto ? 'close' : 'plus'}
          actions={[
            {
              icon: 'pill',
              label: 'Agregar medicamento',
              onPress: () => navigation.navigate('AgregarMedicamento'),
            },
            {
              icon: 'microphone',
              label: 'Grabar nueva nota',
              onPress: () => navigation.navigate('AgregarNotaAudio'),
            },
            {
              icon: 'barcode-scan',
              label: 'Escanear',
              onPress: () => Alert.alert('Escáner', 'Funcionalidad pendiente'),
            },
            {
              icon: 'playlist-music',
              label: 'Ver notas de voz',
              onPress: () => navigation.navigate('NotasDeAudio'),
            },

          ]}
          onStateChange={({ open }) => setMenuAbierto(open)}
          onPress={() => {
            if (menuAbierto) setMenuAbierto(false);
          }}
        />
      </Portal>

      {mostrarGrabadora && (
        <View style={styles.modalAudio}>
          <GrabadoraAudio
            onAudioUri={async (uri) => {
              setNotaDeVoz(uri);
              setMostrarGrabadora(false);
              Alert.alert('Nota guardada', 'Audio registrado correctamente');
              await reproducirNota(uri); // ✅ Ya puedes usar await aquí
            }}
            onClose={() => setMostrarGrabadora(false)}
          />
        </View>
      )}

      {reproduciendo && (
        <Text style={styles.reproduciendo}>🎧 Reproduciendo nota...</Text>
      )}



    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6
  },
  detalle: {
    fontSize: 16
  },
  vacio: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginVertical: 20
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  botonera: {
    marginTop: 10,
    paddingBottom: Platform.OS === 'android' ? 30 : 0, // ⬅️ Ajuste para evitar solapamiento
  },
  botonFlotante: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#1e90ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10
  },
  modalAudio: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 100,
    justifyContent: 'center',
    padding: 20,
  },
  reproduciendo: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
    color: '#1e90ff',
  },


});
