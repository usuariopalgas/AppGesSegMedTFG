// bot/FAQBot.js

const intents = [
    {
        keywords: ['dolor de cabeza', 'cabeza'],
        answer: 'Puedes tomar paracetamol o ibuprofeno si no tienes alergias. Si persiste, consulta a un profesional.',
    },
    {
        keywords: ['verruga', 'verrugas'],
        answer: 'Las verrugas deben ser revisadas por un dermatólogo. Evita tocarlas.',
    },
    {
        keywords: ['paracetamol'],
        answer: 'El paracetamol es útil para dolores leves y fiebre. Sigue las indicaciones del prospecto.',
    },
    {
        keywords: ['fiebre'],
        answer: 'Hidrátate bien, mantén reposo, y usa antitérmicos si lo recomienda un médico.',
    },
    {
        keywords: ['gracias', 'thank you'],
        answer: '¡De nada! Estoy aquí para ayudarte.',
    },
];

const defaultAnswer = 'Lo siento, no entendí eso. ¿Puedes reformular o preguntar otra cosa?';

const quickReplies = [
    { title: 'Dolor de cabeza', value: 'dolor de cabeza' },
    { title: 'Fiebre', value: 'fiebre' },
    { title: 'Verrugas', value: 'verrugas' },
    { title: 'Paracetamol', value: 'paracetamol' },
];

export default {
    getResponse: (text) => {
        const msg = text.trim().toLowerCase();
        for (const intent of intents) {
            for (const word of intent.keywords) {
                if (msg.includes(word)) return intent.answer;
            }
        }
        return defaultAnswer;
    },
    quickReplies,
};