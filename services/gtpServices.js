// services/gptService.js
const OpenAI = require("openai");
const { config } = require("dotenv");
config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 Función para traducir un prompt humano a un comando PLC en JSON
const generarComandoPLC = async (prompt) => {
  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `Eres un asistente que traduce instrucciones humanas a comandos PLC.
        Tu única salida debe ser un objeto JSON válido con la estructura correspondiente.

        Reglas de conversión:
        - Para encender/apagar una salida:
          { "accion": "salida", "pin": 0, "estado": 1 }
        - Para leer una entrada:
          { "accion": "entrada", "pin": 1 }
        - Para leer ADC:
          { "accion": "adc", "canal": 0, "intervalo_ms": 1000, "duracion_ms": 5000 }
        - Para control:
          { "accion": "control","canalAdc":0,"canalPwm":0,"setpoint_volt": 5, "tiempo_simulacion_ms": 5000, "tiempo_muestreo_ms": 1 }

        Valores por defecto:
        - ADC → intervalo_ms = 1000, duracion_ms = 5000
        - CONTROL → canalAdc = 0, canalPwm = 0, tiempo_simulacion_ms = 5000, tiempo_muestreo_ms = 1

        Ejemplos:
        Usuario: "SALIDA Q0 1"
        Asistente: { "accion": "salida", "pin":0, "estado": 1 }

        Usuario: "CONTROL 3.5 8000 200"
        Asistente: { "accion": "control", "canalAdc":0,"canalPwm":0,"setpoint_volt": 3.5, "tiempo_simulacion_ms": 8000, "tiempo_muestreo_ms": 200 }`,
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" }, // ⚡ obliga a JSON válido
  });

  return JSON.parse(completion.choices[0]?.message?.content || "{}");
};

module.exports = { generarComandoPLC };
