const pool = require("../database/config");
const {
  datalogger,
  guardarCaracterizacion,
} = require("../services/datalogger");
const { generarComandoPLC } = require("../services/gtpServices");
const {
  gtpServicesCaracterizacion,
} = require("../services/gtpServicesCaracterizacion");
const { gtpServicesCompara } = require("../services/gtpServicesCompara");
const { gtpServicesControlIA } = require("../services/gtpServicesControlIA");
const {
  identificarModeloIA,
} = require("../services/gtpServicesIndentificacion");
const { gtpServicesPetri } = require("../services/gtpServicesPetri");
const {
  escribirSalida,
  leerEntrada,
  ejecutarADC,
  ejecutarControlPI, 
  Caracterizacion,
  Identificacion,
  ejecutarComparacion,
} = require("../services/plcServicesSimulado");


// const {
//   escribirSalida,
//   leerEntrada,
//   ejecutarADC,
//   ejecutarControlPI, 
//   Caracterizacion,
//   Identificacion,
//   ejecutarComparacion,
// } = require("../services/plcServices");

const procesarPromptIO = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    const comando = await generarComandoPLC(prompt);
    if (!comando || !comando.accion) {
      return { ok: false, msg: "Comando inválido generado" };
    }

    let resultado = null;

    if (comando.accion === "salida") {
      resultado = await escribirSalida({
        pin: comando.pin,
        valor: comando.estado,
      });
    } else if (comando.accion === "entrada") {
      resultado = await leerEntrada(comando.pin);
    }

    return { ok: true, resultado };
  } catch (error) {
    return {
      ok: false,
      msg: "Error al procesar la consulta con GPT",
      error: error.message,
    };
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
        duracion: comando.duracion_ms,
      });
    }

    return { resultado };
  } catch (error) {
    return {
      ok: false,
      msg: "Error al procesar la consulta con GPT",
      error: error.message,
    };
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

    if (comando.accion === "control") {
      const { resultados: res, Prueba } = await ejecutarControlPI({
        canalAdc: comando.canalAdc,
        canalPwm: comando.canalPwm,
        setpoint_volt: comando.setpoint_volt,
        tiempo_muestreo_ms: comando.tiempo_muestreo_ms,
        tiempo_simulacion_ms: comando.tiempo_simulacion_ms,
      });

      resultados = res;
      datalogger({ resultados, Prueba });
    }

    return { ok: true, resultados };
  } catch (error) {
    return {
      ok: false,
      msg: "Error al procesar el control con GPT",
      error: error.message,
    };
  }
};

const procesarPromptSupervisor = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };
    return { ok: true, comando: "Informe generando" };
  } catch (error) {
    return {
      ok: false,
      msg: "Error al procesar el supervisor con GPT",
      error: error.message,
    };
  }
};

const procesarPromptCaracterizacion = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    console.log("Comando caracterización generado:", prompt);

    const comando = await gtpServicesCaracterizacion(prompt);
    //console.log("Comando caracterización procesado:", comando);
    const { resultado, Prueba } = await Caracterizacion({ params: comando });
    const registro = await guardarCaracterizacion({ resultado, Prueba });

    return {
      ok: true,
      msg: "Caracterización procesada e insertada correctamente",
      registro,
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Error al procesar la caracterización con GPT",
      error: error.message,
    };
  }
};

const procesarPromptIdentificacion = async (prompt) => {
  try {
    const client = await pool.connect(); // conectamos un cliente

    let datosPrompt;
    try {
      datosPrompt = typeof prompt === "string" ? JSON.parse(prompt) : prompt;
    } catch {
      return { ok: false, tipo: "Identificacion", error: "JSON inválido." };
    }

    const { consulta, orden } = datosPrompt;

    console.log("Consulta SQL para identificación:", consulta);

    if (!consulta) {
      return {
        ok: false,
        tipo: "Identificacion",
        error: "No hay consulta SQL.",
      };
    }

    const resQuery = await client.query(consulta);
    client.release(); // liberamos el cliente inmediatamente

    if (resQuery.rowCount === 0) {
      return {
        ok: false,
        tipo: "Identificacion",
        error: "No se encontraron registros.",
      };
    }

    const registro = resQuery.rows[0];
    const data = registro.resultado;

    if (!Array.isArray(data)) {
      return {
        ok: false,
        tipo: "Identificacion",
        error: "'resultado' no es un array válido.",
      };
    }

    const { Ts } = await identificarModeloIA({ data, orden });

    await Identificacion({ Ts, data });
    // 🔹 Envío uno a uno con retardo Ts
    return {
      ok: true,
      tipo: "Identificacion",
     
    };
  } catch (error) {
    console.error("❌ Error en procesarPromptIdentificacion:", error);
    return {
      ok: false,
      tipo: "Identificacion",
      error: error.message || "Error interno en el procesamiento.",
    };
  }
};
const procesarPrompComparacion = async (prompt) => {
  try {

    //console.log("Comando Compara:", prompt);
    const comando = await gtpServicesCompara(prompt);
    console.log("Comando Comparacion procesado:", comando);
    const { resultado, Prueba } = await ejecutarComparacion({...comando });

    console.log("Resultado de la comparación:", resultado);
    console.log("Prueba de la comparación:", Prueba);

    return {
      ok: true,
      msg: "Evaluación de red de Petri procesada correctamente",
      registro,
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Error al procesar la caracterización con GPT",
      error: error.message,
    };
  }
};

const procesarPromptPetri = async (prompt) => {
  try {

    console.log("Prompt crudo",prompt);
    // let datosPrompt;
    // try {
    //   datosPrompt = typeof prompt === "string" ? JSON.parse(prompt) : prompt;
    // } catch {
    //   return { ok: false, tipo: "Identificacion", error: "JSON inválido." };
    // }


    console.log("Comando Petri:", prompt);
    //const { consulta, orden } = datosPrompt;
    const comando = await gtpServicesPetri(prompt);
    console.log("Comando Petri procesado:", comando);

    return {
      ok: true,
      msg: "Evaluación de red de Petri procesada correctamente",
      registro,
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Error al procesar la caracterización con GPT",
      error: error.message,
    };
  }
};

const procesarPromptControlIA = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    
    const pruebacaracterizacion = {
        consulta: "SELECT * FROM caracterizacion ORDER BY id ASC OFFSET 0 LIMIT 1;",
        orden: 1
    };

    
    await procesarPromptCaracterizacion(prompt=pruebacaracterizacion);
    
    const pruebaidentificacion = {
      consulta: "SELECT * FROM caracterizacion ORDER BY id ASC OFFSET 0 LIMIT 1;",
      orden: 1
    };
    
    await procesarPromptIdentificacion(prompt=pruebaidentificacion);
    
    console.log("Comando ControlIA:", prompt);
    //const { consulta, orden } = datosPrompt;
    //const comando = await gtpServicesControlIA(prompt);
   
  } catch (error) {
    return {

    };
  }
};



module.exports = {
  procesarPromptIO,
  procesarPromptIAdc,
  procesarPromptControl,
  procesarPromptSupervisor,
  procesarPromptCaracterizacion,
  procesarPromptIdentificacion,
  procesarPromptPetri,
  procesarPrompComparacion,
  procesarPromptControlIA
};
