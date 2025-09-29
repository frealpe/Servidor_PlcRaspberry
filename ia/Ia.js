// mqttConectar.js
const mqtt = require("mqtt");
const { procesarPromptIAdc, procesarPromptIO,procesarPromptControl } = require("../controllers/plcControllerAi");
const { config } = require("dotenv");

config();

const brokerUrl = process.env.BROKER;
const options = {
  username: process.env.MQTT_USER,    // también desde .env
  password: process.env.MQTT_PASS,    // también desde .env
  clientId: "NodeClient_" + Math.random().toString(16).substr(2, 8),
};

const mqttClient = mqtt.connect(brokerUrl, options);

// 🔹 Definir los tópicos en un solo lugar
const TOPICS = ["Plc/Adc", "Plc/Ia", "Plc/Control"];

// 🔹 Inicializar IA
function IA() {
  mqttClient.on("connect", () => {
    console.log("✅ Conectado al broker MQTT");

    // Suscribirse a todos los tópicos definidos en TOPICS
    TOPICS.forEach((topic) => {
      mqttClient.subscribe(topic, { qos: 1 }, (err) => {
        if (err) console.error(`❌ Error suscribiéndose a ${topic}:`, err);
        else console.log(`📡 Suscrito a ${topic}`);
      });
    });
  });

  mqttClient.on("message", async (topic, message) => {
    const msg = message.toString();
    console.log(`📥 Recibido de ${topic}:`, msg);

    try {
      let resultado;

      switch (topic) {
        case "Plc/Adc":
          resultado = await procesarPromptIAdc(msg);
          break;

        case "Plc/Ia":
          resultado = await procesarPromptIO(msg);
          break;

        case "Plc/Control":
          resultado = await procesarPromptControl(msg);
          break;

        default:
          console.warn(`⚠️ Tópico ${topic} no tiene un procesador definido`);
          break;
      }

      if (resultado) {
        console.log("⚙️ Resultado generado:", resultado);
        publicarMQTT("Plc/Respuesta", JSON.stringify(resultado));
      }



    } catch (err) {
      console.error(`❌ Error procesando mensaje de ${topic}:`, err.message);
    }
  });

  mqttClient.on("error", (err) => {
    console.error("🚨 Error MQTT:", err);
  });
}

// 🔹 Función para publicar mensajes
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


module.exports = { mqttClient, IA, publicarMQTT, TOPICS };
