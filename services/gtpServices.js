// services/gptService.js
const OpenAI = require("openai");
const { config } = require("dotenv");
config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 Función: Traducir un prompt humano a un comando PLC estructurado en JSON
const generarComandoPLC = async (prompt) => {
  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `
Eres un asistente que traduce instrucciones humanas a comandos PLC.
Tu única salida debe ser un objeto JSON válido con la estructura correspondiente.
No incluyas texto adicional fuera del JSON.

📘 Reglas de conversión:
- Para encender/apagar una salida:
  {
    "accion": "salida",
    "pin": 0,
    "estado": 1
  }

- Para leer una entrada:
  {
    "accion": "entrada",
    "pin": 1
  }

- Para leer ADC:
  {
    "accion": "adc",
    "canal": 0,
    "intervalo_ms": 1000,
    "duracion_ms": 5000
  }

- Para control:
  {
    "accion": "control",
    "canalAdc": 0,
    "canalPwm": 0,
    "setpoint_volt": 5,
    "tiempo_simulacion_ms": 5000,
    "tiempo_muestreo_ms": 100
  }

- Para caracterización:
  {
    "accion": "caracterizacion",
    "canalAdc": 0,
    "canalPwm": 0,
    "tiempo_muestreo_ms": 100,
    "secuencia": [
      { "porcentaje": 30, "duracion_s": 20 },
      { "porcentaje": 10, "duracion_s": 30 }
    ],
    "descripcion": "Ejecuta una caracterización secuencial del PWM con varios niveles porcentuales durante tiempos definidos."
  }

  Reglas adicionales:
- Si el usuario menciona niveles de porcentaje y duraciones (por ejemplo: “lleva la planta al 30% durante 20s y luego al 10% durante 30s”), genera un campo:
  "secuencia": [
    { "porcentaje": X, "duracion_s": Y },
    ...
  ]
- Si no se especifican valores, usa por defecto:
  [{ "porcentaje": 50, "duracion_s": 10 }]

 Valores por defecto globales:
- ADC → intervalo_ms = 1000, duracion_ms = 5000
- CONTROL → canalAdc = 0, canalPwm = 0, tiempo_simulacion_ms = 5000, tiempo_muestreo_ms = 100
- CARACTERIZACION → canalAdc = 0, canalPwm = 0, tiempo_muestreo_ms = 100

 Ejemplos:
Usuario: "SALIDA Q0 1"
Asistente:
{
  "accion": "salida",
  "pin": 0,
  "estado": 1
}

Usuario: "CONTROL 3.5 8000 200"
Asistente:
{
  "accion": "control",
  "canalAdc": 0,
  "canalPwm": 0,
  "setpoint_volt": 3.5,
  "tiempo_simulacion_ms": 8000,
  "tiempo_muestreo_ms": 200
}

Usuario: "Lleva la planta al 30% de capacidad durante 20 segundos y luego al 10% durante 30 segundos"
Asistente:
{
  "accion": "caracterizacion",
  "canalAdc": 0,
  "canalPwm": 0,
  "tiempo_muestreo_ms": 100,
  "secuencia": [
    { "porcentaje": 30, "duracion_s": 20 },
    { "porcentaje": 10, "duracion_s": 30 }  
  ]
}
        `,
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" }, // ⚡ obliga al modelo a devolver solo JSON válido
  });

  // Devuelve el JSON ya parseado
  return JSON.parse(completion.choices[0]?.message?.content || "{}");
};

module.exports = { generarComandoPLC };
