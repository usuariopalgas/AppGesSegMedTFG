import * as Notifications from 'expo-notifications';

//Solicita permisos para notificaciones push. 
export async function pedirPermisosNotificaciones() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}


//Cancela todas las notificaciones programadas 
export async function cancelarTodasNotificaciones() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Programa una o varias notificaciones para el medicamento según la frecuencia/hora(s) seleccionadas.
 * @param {Object} med - Objeto del medicamento (debe tener nombre, dosis, id, etc)
 * @param {Object} opciones - info adicional: { momentos, dias, tipo, valor, hora, ... }
 * @returns Array de notificationIds
 */
export async function programarNotificacionesMedicamento(med, opciones = {}) {
    let notificationIds = [];

    // 1. Varias tomas concretas al día (ElegirHorariosScreen)
    if (Array.isArray(opciones.momentos)) {
        for (const momento of opciones.momentos) {
            const date = momento.fecha instanceof Date ? momento.fecha : new Date(momento.fecha);
            const hour = date.getHours();
            const minute = date.getMinutes();
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `⏰ Hora de tomar: ${med.nombre}`,
                    body: `Dosis: ${med.dosis || ''}`,
                    sound: true,
                    data: { idMedicamento: med.id },
                },
                trigger: {
                    hour,
                    minute,
                    repeats: true,
                }
            });
            notificationIds.push(id);
        }
    }
    // 2. Intervalo de horas (cada X horas, desde una hora inicial)
    else if (opciones.tipo === 'horas' && opciones.valor && opciones.hora) {
        // Programa varias notificaciones recurrentes cada día (ej: cada 6h = 4 veces al día)
        const hourStart = opciones.hora.getHours();
        const minuteStart = opciones.hora.getMinutes();
        const vecesPorDia = Math.floor(24 / opciones.valor);
        for (let i = 0; i < vecesPorDia; i++) {
            const hour = (hourStart + i * opciones.valor) % 24;
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `⏰ Hora de tomar: ${med.nombre}`,
                    body: `Dosis: ${med.dosis || ''}`,
                    sound: true,
                    data: { idMedicamento: med.id },
                },
                trigger: {
                    hour,
                    minute: minuteStart,
                    repeats: true,
                }
            });
            notificationIds.push(id);
        }
    }
    // 3. Intervalo de días (cada X días a una hora)
    else if (opciones.tipo === 'dias' && opciones.valor && opciones.hora) {
        // Expo Notifications no soporta "cada X días" directamente, así que programa para N días a futuro
        const hour = opciones.hora.getHours();
        const minute = opciones.hora.getMinutes();
        const N = 60; // Días a futuro (ajusta según necesites)
        let date = new Date();
        for (let i = 0; i < N; i += opciones.valor) {
            const triggerDate = new Date(date);
            triggerDate.setDate(date.getDate() + i);
            triggerDate.setHours(hour, minute, 0, 0);
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `⏰ Hora de tomar: ${med.nombre}`,
                    body: `Dosis: ${med.dosis || ''}`,
                    sound: true,
                    data: { idMedicamento: med.id },
                },
                trigger: {
                    type: 'date',
                    date: triggerDate, // <-- aquí el trigger correcto
                }
            });
            notificationIds.push(id);
        }
    }
    // 4. Días específicos de la semana (dias: [1,3,5] y hora: Date)
    else if (Array.isArray(opciones.dias) && opciones.hora) {
        const hour = opciones.hora.getHours();
        const minute = opciones.hora.getMinutes();
        for (const day of opciones.dias) {
            // Expo usa: 1 = domingo ... 7 = sábado
            const expoDay = day === 0 ? 7 : day;
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `⏰ Hora de tomar: ${med.nombre}`,
                    body: `Dosis: ${med.dosis || ''}`,
                    sound: true,
                    data: { idMedicamento: med.id },
                },
                trigger: {
                    weekday: expoDay,
                    hour,
                    minute,
                    repeats: true,
                }
            });
            notificationIds.push(id);
        }
    }
    // 5. Modo cíclico (estructura base, personalízalo según tu app)
    else if (opciones.ciclico && opciones.diasToma && opciones.diasPausa && opciones.fecha) {
        const hour = opciones.fecha.getHours();
        const minute = opciones.fecha.getMinutes();
        const N = opciones.diasToma;
        let date = new Date(opciones.fecha);
        for (let i = 0; i < N; i++) {
            const cicloDate = new Date(date);
            cicloDate.setDate(date.getDate() + i);
            cicloDate.setHours(hour, minute, 0, 0);
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `⏰ Inicio ciclo: ${med.nombre}`,
                    body: `Dosis: ${med.dosis || ''}`,
                    sound: true,
                    data: { idMedicamento: med.id },
                },
                trigger: {
                    type: 'date',
                    date: cicloDate,
                }
            });
            notificationIds.push(id);
        }
    }

    return notificationIds;
}
