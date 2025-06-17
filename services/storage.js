import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = 'meds_encrypted';
const KEY_ITEM = 'dbKey';

//Clave para prueba de concepto TFG
const AES_KEY = 'clave-demo-segura-para-tfg';

// Detecta si es Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Clave de cifrado: fija en Expo Go, SecureStore en builds propias
async function getKey() {
    if (isExpoGo) {
        return AES_KEY;
    } else {
        let key = await SecureStore.getItemAsync(KEY_ITEM);
        if (!key) {
            key = AES_KEY;
            await SecureStore.setItemAsync(KEY_ITEM, key);
        }
        return key;
    }
}

// Cifrado/descifrado sólo en builds propias, no en Expo Go
async function encrypt(text) {
    if (isExpoGo) {
        return text;
    } else {
        const key = await getKey();
        return CryptoJS.AES.encrypt(text, key).toString();
    }
}

async function decrypt(cipher) {
    if (isExpoGo) {
        return cipher;
    } else {
        const key = await getKey();
        const bytes = CryptoJS.AES.decrypt(cipher, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

/** Recupera y descifra la lista de medicamentos */
export async function getMedicamentos() {
    try {
        const encrypted = await AsyncStorage.getItem(STORAGE_KEY);
        if (!encrypted) return [];
        const json = await decrypt(encrypted);
        return JSON.parse(json);
    } catch (error) {
        console.error('Error leyendo medicamentos:', error);
        return [];
    }
}

/** Añade un medicamento cifrando toda la lista */
export async function addMedicamento(med) {
    try {
        const list = await getMedicamentos();
        list.push(med);
        const json = JSON.stringify(list);
        const cipher = await encrypt(json);
        await AsyncStorage.setItem(STORAGE_KEY, cipher);
    } catch (error) {
        console.error('Error guardando medicamento:', error);
        throw error;
    }
}

export async function deleteMedicamento(id) {
    try {
        const list = await getMedicamentos();
        const nuevaLista = list.filter(item => item.id !== id);
        const json = JSON.stringify(nuevaLista);
        const cipher = await encrypt(json);
        await AsyncStorage.setItem(STORAGE_KEY, cipher);
    } catch (error) {
        console.error('Error borrando medicamento:', error);
        throw error;
    }
}



export async function updateMedicamento(id, nuevosDatos) {
    try {
        const list = await getMedicamentos();
        const index = list.findIndex(item => item.id === id);
        if (index === -1) throw new Error('No se encontró el medicamento');
        list[index] = { ...list[index], ...nuevosDatos };
        const json = JSON.stringify(list);
        const cipher = await encrypt(json);
        await AsyncStorage.setItem(STORAGE_KEY, cipher);
    } catch (error) {
        console.error('Error actualizando medicamento:', error);
        throw error;
    }
}

/**
 * Borra un medicamento por su ID y cancela todas sus notificaciones asociadas.
 * @param {string} id - ID del medicamento a eliminar
 */
export async function borrarMedicamentoConNotificaciones(id) {
    try {
        const meds = await getMedicamentos();
        const med = meds.find(m => m.id === id);

        // Cancela todas las notificaciones asociadas a este medicamento (si existen)
        if (med && Array.isArray(med.notificaciones)) {
            for (const notifId of med.notificaciones) {
                try {
                    await Notifications.cancelScheduledNotificationAsync(notifId);
                } catch (e) {
                    console.warn('No se pudo cancelar la notificación:', notifId, e);
                }
            }
        }

        // Borra el medicamento del storage
        await deleteMedicamento(id);
    } catch (e) {
        console.error('Error al borrar medicamento y sus notificaciones:', e);
    }
}
