const { config } = require("dotenv");
const mqtt = require('mqtt');

config();
//////////////////////////////////////////////////////////////////////
// Configuración del broker
//const brokerUrl = 'mqtt://127.0.0.1:1883';
//const brokerUrl = 'mqtt://localhost:1883';
const brokerUrl = process.env.BROKER;
const options = {
  username: process.env.MQTT_USER,    // también desde .env
  password: process.env.MQTT_PASS,    // también desde .env
  clientId: "NodeClient_" + Math.random().toString(16).substr(2, 8),
};

//////////////////////////////////////////////////////////////////////
// Conectar al broker
const mqttClient = mqtt.connect(brokerUrl, options);
//////////////////////////////////////////////////////////////////////
// Lista de topics a suscribirse (quitando 'Plc/Ia')
const topics = ['Plc/Pwm', 'Plc/Timer', 'Plc/Setpoint','Plc/Resp'];
//////////////////////////////////////////////////////////////////////
// Buffer para almacenar los últimos N mensajes por topic
const MAX_MENSAJES = 1000;
const mensajesPorTopic = {}; // { topic: [msg1, msg2, ...] }
//////////////////////////////////////////////////////////////////////
// Suscribirse a los topics generales
mqttClient.on('connect', () => {
    console.log('Conectado al broker MQTT');

    topics.forEach(topic => {
        mqttClient.subscribe(topic, { qos: 1 }, (err) => {
            if (!err) console.log(`Suscrito a ${topic}`);
            else console.error(`Error suscribiéndose a ${topic}:`, err);
        });
    });

    // Suscribirse por separado a Plc/Ia
    mqttClient.subscribe('Plc/Ia', { qos: 1 }, (err) => {
        if (!err) console.log('Suscrito al tópico Plc/Ia');
        else console.error('Error suscribiéndose a Plc/Ia:', err);
    });
});
//////////////////////////////////////////////////////////////////////
// Recibir mensajes
mqttClient.on('message', (topic, message) => {
    const msg = message.toString();
    // Procesar los demás tópicos en el buffer general
    if (!mensajesPorTopic[topic]) mensajesPorTopic[topic] = [];
    mensajesPorTopic[topic].push({ msg, timestamp: Date.now() });

    if (mensajesPorTopic[topic].length > MAX_MENSAJES) {
        mensajesPorTopic[topic].shift(); // eliminar el más antiguo
    }

    console.log(`Mensaje recibido en configuración general ${topic}: ${msg}`);
});
//////////////////////////////////////////////////////////////////////
mqttClient.on('error', (err) => {
    console.error('Error MQTT:', err);
});
//////////////////////////////////////////////////////////////////////
// Función para publicar mensajes
function publicarMQTT(topic, mensaje) {
    if (mqttClient && mqttClient.connected) {
        mqttClient.publish(topic, mensaje, { qos: 1 }, (err) => {
            if (err) console.error(`Error al publicar en ${topic}:`, err);
            else console.log(`Publicado en ${topic}: ${mensaje}`);
        });
    } else {
        console.log('Cliente MQTT no conectado');
    }
}
//////////////////////////////////////////////////////////////////////
module.exports = {
    mqttClient,
    publicarMQTT,
    mensajesPorTopic
};
