// services/gptService.js
const OpenAI = require("openai");
const { config } = require("dotenv");
config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generarComandoPLC = async (prompt) => {
  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `Eres un asistente que traduce instrucciones humanas a comandos PLC.
              - Para encender una salida: SALIDA <pin> <valor>   (ej: SALIDA Q0 1)
              - Para apagar una salida: SALIDA <pin> 0
              - Para leer una entrada: ENTRADA <pin>
              - Para leer un valor analógico (ADC):
                  Sintaxis: ADC <canal> [intervalo_ms] [duracion_ms]
                  • <canal>: el canal ADC a leer (ej: 0, 1, 2…)
                  • [intervalo_ms]: opcional, tiempo entre lecturas en milisegundos (por defecto 1000 ms)
                  • [duracion_ms]: opcional, duración total de la prueba en milisegundos (por defecto 5000 ms)

              Ejemplos:
              - "ADC 0" → lee canal 0 cada 1000 ms durante 5000 ms
              - "ADC 2 500" → lee canal 2 cada 500 ms durante 5000 ms
              - "ADC 1 1000 10000" → lee canal 1 cada 1000 ms durante 10000 ms`,
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content?.trim();
};

module.exports = { generarComandoPLC };
