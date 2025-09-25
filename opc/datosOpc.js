// mqttConectar.js
const mqtt = require("mqtt");
const { config } = require("dotenv");
const {procesarPromptIAdc } = require("../controllers/plcControllerAi"); // asegúrate de que el archivo se llama así

config();

  const apiKey = process.env.BROKER_APIKEY;
//////////////////////////////////////////////////////////////////////
// Configuración del broker
const brokerUrl = 'mqtt://10.233.106.180:1883';
const options = {
    username: 'plcuser',
    password: 'plc',
    clientId: 'NodeClient_' + Math.random().toString(16).substr(2, 8)
};

const mqttClient = mqtt.connect(brokerUrl, options);
function DatosOpc() {
  mqttClient.on("connect", () => {
    console.log("✅ Conectado al broker MQTT");

    mqttClient.subscribe("Plc/Adc", { qos: 1 }, (err) => {
      if (err) console.error("❌ Error suscribiéndose a Plc/Ia:", err);
      else console.log("📡 Suscrito a Plc/Adc");
    });
  });

  mqttClient.on("message", async (topic, message) => {
    if (topic === "Plc/Adc") {
      const msg = message.toString();
      console.log("📥 Recibido de Plc/Adc:", msg);

      try {
        const resultado = await procesarPromptIAdc(msg);
        console.log("⚙️ Resultado generado:", resultado);

        // 📡 Publicar la respuesta en otro topic
        publicarMQTT("Plc/Respuesta", JSON.stringify(resultado));

      } catch (err) {
        console.error("❌ Error procesando mensaje MQTT:", err.message);
      }
    }
  });

  mqttClient.on("error", (err) => {
    console.error("🚨 Error MQTT:", err);
  });
}

// Función para publicar mensajes
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

module.exports = { mqttClient, DatosOpc, publicarMQTT };
