// services/gptServiceControlIA.js
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const { config } = require("dotenv");
config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧠 gtpServicesControlIA
 * ---------------------------
 * Genera automáticamente una función `ControlIA` en Node.js
 * a partir del modelo de la planta y un factor de amortiguamiento (ζ).
 * Si el usuario no lo menciona, se usa ζ = 0.7 por defecto.
 * 🔹 Controlador estrictamente PI (sin término derivativo).
 */
const gtpServicesControlIA = async (prompt) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new Error("❌ El prompt no puede estar vacío o ser inválido.");
  }

  try {
    // 🔹 Detectar zita especificado o usar 0.7 por defecto
    const zitaMatch = prompt.match(/(?:zita|ζ)\s*=?\s*([\d.]+)/i);
    const zita = zitaMatch ? parseFloat(zitaMatch[1]) : 0.7;

    // 🔹 Prompt de generación
    const fullPrompt = `
Eres un ingeniero experto en control automático discreto y diseño de controladores **PI**.

Genera una función **ControlIA** en Node.js que implemente exclusivamente un controlador **PI** (no PID)
basado en los coeficientes del modelo de la planta proporcionados en el prompt del usuario,
ajustando su desempeño con un amortiguamiento deseado ζ = ${zita}.

🧩 La función debe:

- Tener esta firma:
const ControlIA = async ({
  canalAdc,
  canalPwm,
  setpoint_volt,
  tiempo_muestreo_ms,
  tiempo_simulacion_ms,
}) => { ... }

- Incluir la función:
const leerADC = async ({ canal, tiempo }) => {
  if (canal !== undefined) {
    const conversion = rpiplc.readADC(canal);
    Sockets.enviarMensaje("adcPlc", { canal, conversion, tiempo });
    return conversion >= 0 ? conversion : 0;
  }
  return null;
};

- Usar los coeficientes del modelo de planta provistos en el prompt (por ejemplo: y[k] = a1*y[k-1] + b1*u[k-1]).
- Calcular **Kp** y **Ti** automáticamente usando el método **Åström–Hägglund**, ajustando la respuesta para lograr ζ ≈ ${zita}.
- Mantener la estructura exacta de la función **ejecutarControlPI**:
  1. Leer ADC (función leerADC)
  2. Escalar a voltaje (0–10 V)
  3. Calcular error = setpoint - voltaje
  4. Aplicar control PI: u = Kp * (error + integral / Ti)
  5. Saturar salida en [0, 10]
  6. Convertir a PWM (0–4095)
  7. Escribir PWM con rpiplc.writePWM
  8. Guardar resultados (tiempo, voltaje, pwm)
  9. Esperar el siguiente tiempo de muestreo
- Retornar:
  { Prueba: fecha_actual, resultados: [ { tiempo, voltaje, pwm } ] }

⚙️ Importar:
const rpiplc = require("../rpiplc-addon/build/Release/rpiplc");
const { PINES } = require("./helpers");
const Sockets = require("../lib/socket");

📦 Exportar:
module.exports = { ControlIA };

⚠️ Devuelve **solo código JavaScript válido**, sin texto adicional ni comentarios.
⚠️ No incluir ningún término derivativo (Kd, derivative, dError).
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Eres un ingeniero experto en control discreto, especializado en sintonización de controladores PI por Åström–Hägglund. Nunca uses control derivativo.",
        },
        { role: "user", content: `${fullPrompt}\n${prompt}` },
      ],
    });

    let code = completion.choices?.[0]?.message?.content?.trim() || "";

    // 🧹 Limpieza del código recibido
    code = code
      .replace(/```(javascript)?/g, "")
      .replace(/module\.exports\s*=\s*\{[^}]*\};/g, "")
      .trim();

    // 🧩 Validación: debe contener la función ControlIA
    if (!code.includes("ControlIA")) {
      throw new Error("El modelo no devolvió una función ControlIA válida.");
    }

    // 🚫 Validación: prohibir control derivativo (PID)
    const forbiddenTerms = /(Kd|derivative|dError|dif(erencia)?)/i;
    if (forbiddenTerms.test(code)) {
      throw new Error("⚠️ Se detectó un término derivativo (PID). Solo se permite control PI.");
    }

    // 📦 Asegurar exportación al final
    if (!code.includes("module.exports")) {
      code += `\n\nmodule.exports = { ControlIA };`;
    }

    // 💾 Guardar en controllers/ControlIA.js
    const outputPath = path.join(process.cwd(), "controllers", "ControlIA.js");
    fs.writeFileSync(outputPath, code, "utf8");

    return {
      ok: true,
      zita,
      code,
      ruta: outputPath,
    };
  } catch (error) {
    console.error("❌ Error en gtpServicesControlIA:", error.message);

    // 🧩 Control PI por defecto si falla la generación
    const fallbackCode = `
const rpiplc = require("../rpiplc-addon/build/Release/rpiplc");
const { PINES } = require("./helpers");
const Sockets = require("../lib/socket");

const leerADC = async ({ canal, tiempo }) => {
  if (canal !== undefined) {
    const conversion = rpiplc.readADC(canal);
    Sockets.enviarMensaje("adcPlc", { canal, conversion, tiempo });
    return conversion >= 0 ? conversion : 0;
  }
  return null;
};

const ControlIA = async ({
  canalAdc,
  canalPwm,
  setpoint_volt,
  tiempo_muestreo_ms,
  tiempo_simulacion_ms,
}) => {
  const Kp = 1.2;
  const Ti = 0.5;
  const Ts = tiempo_muestreo_ms / 1000.0;
  let integralError = 0.0;
  let tiempoTranscurrido = 0;
  const fin = Date.now() + tiempo_simulacion_ms;
  const resultados = [];

  function piController(error) {
    let u = Kp * (error + (integralError / Ti));
    u = Math.min(Math.max(u, 0), 10);
    integralError += Ts * error;
    return u;
  }

  while (Date.now() < fin) {
    const conversion = await leerADC({ canal: canalAdc, tiempo: tiempoTranscurrido });
    const voltage = (10.0 * conversion) / 4095.0;
    const error = setpoint_volt - voltage;
    const controlVoltage = piController(error);
    const valorPWM = Math.round((controlVoltage * 4095.0) / 10.0);
    rpiplc.writePWM(canalPwm, valorPWM);
    resultados.push({
      tiempo: tiempoTranscurrido.toFixed(2),
      voltaje: voltage.toFixed(2),
      pwm: valorPWM,
    });
    tiempoTranscurrido += Ts;
    await new Promise((r) => setTimeout(r, tiempo_muestreo_ms));
  }

  return { Prueba: new Date().toISOString(), resultados };
};

module.exports = { ControlIA };
`;

    return {
      ok: false,
      zita: 0.7,
      code: fallbackCode,
    };
  }
};

module.exports = { gtpServicesControlIA };
