// controllers/chatgptplc.js

const { datalogger, caracterizacion } = require("../services/datalogger.js");
const { saveEmbedding } = require("../services/embedding.js");
const { generarComandoPLC } = require("../services/gtpServices");
//const { escribirSalida, leerEntrada, ejecutarADC, ejecutarControlPI, ejecutarCaracterizacion } = require("../services/plcServicesSimulado");
const { escribirSalida, leerEntrada, ejecutarADC, ejecutarControlPI,ejecutarCaracterizacion } = require("../services/plcServices");
const procesarPromptIO = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    const comando = await generarComandoPLC(prompt);
    console.log("📥 Comando generado recibido (IO):", comando);

    if (!comando || !comando.accion) {
      return { ok: false, msg: "Comando inválido generado" };
    }

    let resultado = null;

    if (comando.accion === "salida") {
       resultado = await escribirSalida({ pin: comando.pin, valor: comando.estado });
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
    //console.log(resultado);
    return {resultado };

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

// 🧠 Procesa un prompt y ejecuta la caracterización
const procesarPromptCaracterizacion = async (prompt) => {
  try {
    console.log("🤖 Procesando prompt de caracterizacion");
    if (!prompt) {
      return { ok: false, msg: "El campo 'prompt' es obligatorio" };
    }

    // 🧩 Paso 1: Interpretar prompt con GPT → comando PLC
    const comando = await generarComandoPLC(prompt);
    console.log("📥 Comando generado recibido (Caracterización):", comando);

    if (!comando || comando.accion !== "caracterizacion") {
      return {
        ok: false,
        msg: "No se generó un comando de caracterización válido",
        comando,
      };
    }

    // 🧩 Paso 2: Preparar parámetros para la ejecución
    const parametros = {
      canalAdc: comando.canalAdc ?? 0,
      canalPwm: comando.canalPwm ?? 0,
      tiempo_muestreo_ms: comando.tiempo_muestreo_ms ?? 100,
      secuencia: Array.isArray(comando.secuencia) && comando.secuencia.length > 0
        ? comando.secuencia
        : [
            // 🔧 Secuencia por defecto si GPT no la genera
            { porcentaje: 50, duracion_s: 10 },
            { porcentaje: 20, duracion_s: 10 },
          ],
    };

    console.log("🧠 Parámetros generados para caracterización:", parametros);

    // ⚙️ Paso 3: Ejecutar la caracterización con los parámetros recibidos
    const { resultados: res, Prueba } = await ejecutarCaracterizacion(parametros);

    // 🧾 Paso 4: Registrar o guardar resultados (si aplica)
    caracterizacion({ resultados: res, Prueba });
    // saveEmbedding({ prompt, resultados: res, Prueba });

    console.log("✅ Caracterización completada con éxito.");

    // 🧩 Paso 5: Retornar respuesta estándar
    return { ok: true, resultados: res, Prueba };

  } catch (error) {
    console.error("❌ Error en procesarPromptCaracterizacion:", error);
    return {
      ok: false,
      msg: "Error al procesar la caracterización con GPT",
      error: error.message,
    };
  }
};




module.exports = { 
  procesarPromptIO, 
  procesarPromptIAdc, 
  procesarPromptControl,
  procesarPromptSupervisor,
  procesarPromptCaracterizacion 
};
