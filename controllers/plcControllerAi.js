// controllers/chatgptplc.js

const { generarComandoPLC } = require("../services/gtpServices");
const { escribirSalida, leerEntrada,leerADC, ejecutarADC } = require("../services/plcServices");

const procesarPromptIO = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    console.log("📥 Prompt recibido:", prompt);
    const comando = await generarComandoPLC(prompt);
    console.log("⚙️ Comando generado:", comando);

    if (!comando) {
      return { ok: true, comando: null, resultado: "GPT no devolvió comando válido" };
    }

    const partes = comando.split(" ");
    const accion = partes[0];
    let resultado;

    if (accion === "SALIDA") {
      if (partes.length < 3) resultado = "❌ Error: formato inválido en comando SALIDA";
      else resultado = escribirSalida(partes[1], parseInt(partes[2], 10));
    } 
    else if (accion === "ENTRADA") {
      if (partes.length < 2) resultado = "❌ Error: formato inválido en comando ENTRADA";
      else resultado = leerEntrada(partes[1]);
    } 
    else resultado = `❓ Acción desconocida: ${accion}`;

    return { ok: true, prompt, comando, resultado };
  } catch (error) {
    console.error("❌ Error en procesarPrompt:", error.message);
    return { ok: false, msg: "Error al procesar la consulta con GPT", error: error.message };
  }
};


const procesarPromptIAdc = async (prompt) => {
  try {
    if (!prompt) return { ok: false, msg: "El campo 'prompt' es obligatorio" };

    console.log("📥 Prompt recibido:", prompt);

    const comando = await generarComandoPLC(prompt);
    console.log("⚙️ Comando generado:", comando);

    if (!comando) {
      return { ok: true, comando: null, resultado: "GPT no devolvió comando válido" };
    }

    const partes = comando.split(" ");
    const accion = partes[0];
    let resultado;

    if (accion === "ADC") {
      if (partes.length < 2) {
        resultado = "❌ Error: formato inválido en comando ADC";
      } else {
        const canal = parseInt(partes[1], 10);
        const intervalo = partes[2] ? parseInt(partes[2], 10) : 1000; // ms
        const duracion = partes[3] ? parseInt(partes[3], 10) : 5000;   // ms

        resultado = await ejecutarADC(canal, intervalo, duracion);
      }
    } else {
      resultado = `❓ Acción desconocida: ${accion}`;
    }

    return { ok: true, prompt, comando, resultado };
  } catch (error) {
    console.error("❌ Error en procesarPromptIAdc:", error.message);
    return { ok: false, msg: "Error al procesar la consulta con GPT", error: error.message };
  }
};




module.exports = { procesarPromptIO,procesarPromptIAdc};
