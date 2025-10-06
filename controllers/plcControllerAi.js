// controllers/chatgptplc.js

const { datalogger } = require("../services/datalogger.js");
const { saveEmbedding } = require("../services/embedding.js");
const { generarComandoPLC } = require("../services/gtpServices");
//const { escribirSalida, leerEntrada, ejecutarADC, ejecutarControlPI } = require("../services/plcServicesSimulado");
const { escribirSalida, leerEntrada, ejecutarADC, ejecutarControlPI } = require("../services/plcServices");
const procesarPromptIO = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    const comando = await generarComandoPLC(prompt);
    // console.log("📥 Comando generado recibido (IO):", comando);

    if (!comando || !comando.accion) {
      return { ok: false, msg: "Comando inválido generado" };
    }

    let resultado = null;

    if (comando.accion === "salida") {
      resultado = await escribirSalida(comando.pin, comando.estado);
    } else if (comando.accion === "entrada") {
      resultado = await leerEntrada(comando.pin);
    }

    return { ok: true, resultado };

  } catch (error) {
    console.error("❌ Error en procesarPromptIO:", error.message);
    return { ok: false, msg: "Error al procesar la consulta con GPT", error: error.message };
  }
};

const procesarPromptIAdc = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    const comando = await generarComandoPLC(prompt);
    if (!comando || !comando.accion) {
      return { ok: false, msg: "Comando inválido generado" };
    }

    let resultado = null;

    if (comando.accion === "adc") {
      resultado = await ejecutarADC({
        canal: comando.canal,
        muestreo: comando.intervalo_ms,
        duracion: comando.duracion_ms
      });
    }

    return { ok: true, resultado };

  } catch (error) {
    console.error("❌ Error en procesarPromptIAdc:", error.message);
    return { ok: false, msg: "Error al procesar la consulta con GPT", error: error.message };
  }
};

const procesarPromptControl = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    const comando = await generarComandoPLC(prompt);
    if (!comando || !comando.accion) {
      return { ok: false, msg: "Comando inválido generado" };
    }

    let resultados = null;

    if (comando.accion === 'control') {
      const { resultados: res, Prueba } = await ejecutarControlPI({
        canalAdc: comando.canalAdc,
        canalPwm: comando.canalPwm,
        setpoint_volt: comando.setpoint_volt,
        tiempo_muestreo_ms: comando.tiempo_muestreo_ms,
        tiempo_simulacion_ms: comando.tiempo_simulacion_ms
      });

      resultados = res;
      datalogger({ resultados, Prueba });
      //saveEmbedding({ prompt, resultados, Prueba });

    }

    return { ok: true, resultados };

  } catch (error) {
    console.error("❌ Error en procesarPromptControl:", error.message);
    return { ok: false, msg: "Error al procesar el control con GPT", error: error.message };
  }
};

const procesarPromptSupervisor = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    return { ok: true, comando: "Informe generando" };

  } catch (error) {
    console.error("❌ Error en procesarPromptSupervisor:", error.message);
    return { ok: false, msg: "Error al procesar el supervisor con GPT", error: error.message };
  }
};

module.exports = { 
  procesarPromptIO, 
  procesarPromptIAdc, 
  procesarPromptControl,
  procesarPromptSupervisor 
};
