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
        content: `Eres un asistente que traduce instrucciones a comandos PLC.
- Para encender una salida usa: SALIDA <pin> <valor>   (ej: SALIDA Q0 1).
- Para apagar una salida usa: SALIDA <pin> 0.
- Para leer una entrada usa: ENTRADA <pin>.`,
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content?.trim();
};

module.exports = { generarComandoPLC };
