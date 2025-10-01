// mqttService.js
const mqtt = require("mqtt");
const { config } = require("dotenv");
config();

const brokerUrl = process.env.BROKER;
const options = {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  clientId: "NodeClient_" + Math.random().toString(16).substr(2, 8),
};

const mqttClient = mqtt.connect(brokerUrl, options);

// Buffer opcional
const mensajesPorTopic = {};
const MAX_MENSAJES = 1000;

// Publicar
function publicarMQTT(topic, mensaje) {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, mensaje, { qos: 1 }, (err) => {
      if (err) console.error(`❌ Error al publicar en ${topic}:`, err);
      else console.log(`📤 Publicado en ${topic}: ${mensaje}`);
    });
  } else {
    console.log("⚠️ Cliente MQTT no conectado");
  }
}

// Suscribirse a lista de tópicos con callback
function suscribirTopics(topics, handler) {
  mqttClient.on("connect", () => {
    topics.forEach((topic) => {
      mqttClient.subscribe(topic, { qos: 1 }, (err) => {
        if (err) console.error(`❌ Error suscribiéndose a ${topic}:`, err);
        else console.log(`📡 Suscrito a ${topic}`);
      });
    });
  });

  mqttClient.on("message", (topic, message) => {
    const msg = message.toString();

    // Guardar en buffer
    if (!mensajesPorTopic[topic]) mensajesPorTopic[topic] = [];
    mensajesPorTopic[topic].push({ msg, timestamp: Date.now() });
    if (mensajesPorTopic[topic].length > MAX_MENSAJES) {
      mensajesPorTopic[topic].shift();
    }

    // Pasar a handler
    if (handler) handler(topic, msg);
  });
}

mqttClient.on("error", (err) => {
  console.error("🚨 Error MQTT:", err);
});

module.exports = { mqttClient, publicarMQTT, suscribirTopics, mensajesPorTopic };
