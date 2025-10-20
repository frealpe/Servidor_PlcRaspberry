// services/gptService.js
const OpenAI = require("openai");
const { config } = require("dotenv");
config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * gtpServicesCaracterizacion
 * ---------------------------
 * Traduce instrucciones naturales a parámetros de caracterización de planta discretos.
 * Garantiza claves con formato exacto: N, PwmPin, AdcPin, Ts, Offset y amplitud
 */
const gtpServicesCaracterizacion = async (prompt) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new Error("❌ El prompt no puede estar vacío o ser inválido.");
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `
Eres un ingeniero experto en identificación de sistemas discretos.
Tu tarea es devolver **únicamente** un objeto JSON con los parámetros de caracterización de una planta.

Instrucciones:
1. Si el usuario dice solo "caracterizar la planta" o una instrucción equivalente sin parámetros definidos,
   responde exactamente:
   {
     "N": "1000",
     "PwmPin": "0",
     "AdcPin": "0",
     "Ts": "50",
     "Offset": "0.5",
     "amplitud": "0.1"
   }

2. Si el usuario proporciona parámetros (aunque estén en minúsculas o mezcladas), 
   debes interpretarlos y devolverlos con las claves normalizadas: N, PwmPin, AdcPin, Ts, Offset

3. Si el prompt menciona un rango de porcentaje (ej. "secuencia binaria entre 25% y 75%"),
   calcula:
   - amplitud = max - min
   - Offset = (max + min)/2

4. La salida debe ser **solo JSON válido**, sin explicaciones ni texto adicional.
          `,
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const rawResponse = completion.choices?.[0]?.message?.content?.trim();
    if (!rawResponse) throw new Error("Respuesta vacía del modelo.");

    // Intentar parsear JSON
    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      console.warn("⚠️ JSON con ruido, intentando limpiar...");
      const repaired = rawResponse.replace(/^[^{]+|[^}]+$/g, "");
      parsed = JSON.parse(repaired);
    }

    // 🔹 Normalizar las claves del JSON
    const normalized = normalizeKeys(parsed);

    // 🔹 Detectar rango de porcentaje en el prompt
    const rangoMatch = prompt.match(/(\d+)\s*%.*?(\d+)\s*%/);
    if (rangoMatch) {
      const min = parseFloat(rangoMatch[1]) / 100;
      const max = parseFloat(rangoMatch[2]) / 100;

      normalized.amplitud = (max - min).toFixed(3);
      normalized.Offset = ((min + max) / 2).toFixed(3);
    }

    // 🔹 Asegurar que todas las claves estén presentes
    const complete = ensureDefaults(normalized);

    return complete;
  } catch (error) {
    console.error("❌ Error en gtpServicesCaracterizacion:", error.message);
    return {
      N: "1000",
      PwmPin: "0",
      AdcPin: "0",
      Ts: "50",
      Offset: "0.5",
      amplitud: "0.1",
      error: "default_applied",
    };
  }
};

// 🔧 Función para normalizar nombres de claves a formato estándar
function normalizeKeys(obj) {
  const mapping = {
    n: "N",
    npuntos: "N",
    muestras: "N",
    pwmpin: "PwmPin",
    pwm_pin: "PwmPin",
    pinpwm: "PwmPin",
    pwm0: "PwmPin",
    adc0: "AdcPin",
    adcpin: "AdcPin",
    adc_pin: "AdcPin",
    pinadc: "AdcPin",
    ts: "Ts",
    tiempo: "Ts",
    tiempoms: "Ts",
    offset: "Offset",
    amplitud: "amplitud",
  };

  const normalized = {};

  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z]/g, "");
    const mapped = mapping[cleanKey];
    if (mapped) {
      normalized[mapped] = String(value);
    } else if (["n", "pwmpin", "adcpin", "ts", "offset", "amplitud"].includes(cleanKey)) {
      const normalizedKey = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
      normalized[normalizedKey] = String(value);
    } else {
      console.warn(`⚠️ Clave desconocida ignorada: ${key}`);
    }
  }

  return normalized;
}

// 🔧 Función para asegurar que todas las claves estén presentes
function ensureDefaults(obj) {
  const defaults = {
    N: "1000",
    PwmPin: "0",
    AdcPin: "0",
    Ts: "50",
    Offset: "0.5",
    amplitud: "0.1",
  };

  for (const key in defaults) {
    if (!(key in obj)) {
      obj[key] = defaults[key];
    }
  }
  return obj;
}

module.exports = { gtpServicesCaracterizacion };
