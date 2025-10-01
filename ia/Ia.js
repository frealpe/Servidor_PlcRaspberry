
const { procesarPromptIAdc, procesarPromptIO, procesarPromptControl, procesarPromptSupervisor } = require("../controllers/plcControllerAi");
const { publicarMQTT, suscribirTopics } = require("../mqtt/conectMqtt");

function IA() {
  suscribirTopics(["Plc/Adc","Plc/Ia","Plc/Control","Plc/Supervisor"], async (topic, msg) => {
    try {
      let resultado;
      switch (topic) {
        case "Plc/Adc":
          resultado = await procesarPromptIAdc(msg); break;
        case "Plc/Ia":
          resultado = await procesarPromptIO(msg); break;
        case "Plc/Control":
          resultado = await procesarPromptControl(msg); break;
        case "Plc/Supervisor":
          resultado = await procesarPromptSupervisor(msg); break;
      }
      if (resultado) {
        publicarMQTT("Plc/Respuesta", JSON.stringify(resultado));
      }
    } catch (err) {
      console.error(`❌ Error procesando mensaje de ${topic}:`, err.message);
    }
  });
}

module.exports = {IA};
