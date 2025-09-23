// controllers/chatgptplc.js
const OpenAI = require("openai");
const { config } = require("dotenv");
const plc = require("../rpiplc-addon/build/Release/rpiplc");

config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mapeo de salidas (Q0–Q23)
const PINES = {
  "0": 20971532,
  "1": 20971531,
  "2": 20971535,
  "3": 20971534,
  "4": 20971526,
  "5": 20971527,
  "6": 20971522,
  "7": 20971520,
  "8": 20971530,
  "9": 21037057,
  "10": 20971529,
  "11": 21037056,
  "12": 20971533,
  "13": 20971528,
  "14": 20971525,
  "15": 20971521,
  "16": 21037063,
  "17": 21037062,
  "18": 21037059,
  "19": 21037061,
  "20": 21037058,
  "21": 21037060,
  "22": 20971524,
  "23": 20971523,
};

// 👉 Función principal
const procesarPrompt = async (prompt) => {
  try {
    console.log("📥 Prompt recibido:", prompt);

    if (!prompt) {
      return { ok: false, msg: "El campo 'prompt' es obligatorio" };
    }

    // 🔮 GPT traduce a comando PLC
    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `Eres un asistente que traduce instrucciones a comandos PLC.
          - Para encender una salida usa: SALIDA <pin> <valor>   (ej: SALIDA Q0 1).
          - Para apagar una salida usa: SALIDA <pin> 0.
          - Para leer una entrada usa: ENTRADA <pin>.`,
        },
        { role: "user", content: prompt },
      ],
    });

    const comando = completion.choices[0]?.message?.content?.trim();
    console.log("⚙️ Comando generado:", comando);

    if (!comando) {
      return { ok: true, comando: null, resultado: "GPT no devolvió comando válido" };
    }

    const partes = comando.split(" ");
    const accion = partes[0]; // SALIDA o ENTRADA
    let resultado;

    if (accion === "SALIDA") {
      if (partes.length < 3) {
        resultado = "❌ Error: formato inválido en comando SALIDA";
      } else {
        const pin = partes[1]; // ej: Q0
        const valor = parseInt(partes[2], 10);
        const pinNumber = pin.replace("Q", ""); // "Q0" → "0"

        if (PINES[pinNumber] !== undefined && (valor === 0 || valor === 1)) {
          plc.writeDigital(PINES[pinNumber], valor); // 👈 Igual que tu test
          resultado = `✅ Salida ${pin} configurada en ${valor}`;
        } else {
          resultado = `⚠️ Pin ${pin} no definido o valor inválido`;
        }
      }
    } else if (accion === "ENTRADA") {
      if (partes.length < 2) {
        resultado = "❌ Error: formato inválido en comando ENTRADA";
      } else {
        const pin = partes[1]; // ej: I1
        const pinNumber = pin.replace("I", ""); // "I1" → "1"

        if (PINES[pinNumber] !== undefined) {
          const valor = plc.readDigital(PINES[pinNumber]);
          resultado = `📥 Entrada ${pin} leída: ${valor}`;
        } else {
          resultado = `⚠️ Pin ${pin} no definido en la tabla`;
        }
      }
    } else {
      resultado = `❓ Acción desconocida: ${accion}`;
    }

    return { ok: true, prompt, comando, resultado };
  } catch (error) {
    console.error("❌ Error en procesarPrompt:", error.message);
    return {
      ok: false,
      msg: "Error al procesar la consulta con GPT",
      error: error.message,
    };
  }
};

module.exports = { procesarPrompt };
