const rpiplc = require("../rpiplc-addon/build/Release/rpiplc");
const { PINES } = require("./helpers");
const Sockets = require("../lib/socket");
// =======================
// Escritura digital
// =======================
const escribirSalida = ({ pin, valor }) => {
  if (pin !== undefined && (valor === 0 || valor === 1)) {
    rpiplc.writeDigital(PINES[pin], valor);
    console.log(`✅ Salida ${PINES[pin]} configurada en ${valor}`);
    return `✅ Salida ${pin} configurada en ${valor}`;
  }
  return `⚠️ Pin ${pin} no definido o valor inválido`;
};

// =======================
// Lectura digital
// =======================
const leerEntrada = (pin) => {
  if (pin !== undefined) {
    const valor = rpiplc.readDigital(PINES[pin]);
    return valor;
  }
  return `⚠️ Pin ${pin} no definido en la tabla`;
};

// =======================
// Lectura de ADC
// =======================
const leerADC = async ({ canal, tiempo }) => {
  //console.log("canal",canal);
  if (canal !== undefined) {
    const conversion = rpiplc.readADC(canal);
    //console.log(conversion);
    Sockets.enviarMensaje('adcPlc',{ canal, conversion, tiempo });
    return conversion >= 0 ? conversion : 0; // asegura valor no negativo
  }
  return null;
};

// =======================
// Lectura periódica de ADC
// =======================
const ejecutarADC = async ({ canal, muestreo, duracion }) => {
  const fin = Date.now() + duracion;
  const resultado = [];
  const Ts = muestreo / 1000; // segundos
  let tiempoTranscurrido = 0;

  while (Date.now() < fin) {
    const tiempoActual = parseFloat(tiempoTranscurrido.toFixed(2));

    const conversion = await leerADC({canal, tiempo: tiempoActual });
    const voltage = (10.0 * conversion) / 4095.0;
    resultado.push({
      canal,
      tiempo: tiempoActual,
      voltaje:voltage,
    });
    tiempoTranscurrido += Ts;
    await new Promise((r) => setTimeout(r, muestreo));
  }

  return resultado;
};

// =======================
// Escritura de PWM
// =======================
const escribirPWM = ( canal, pwmValue ) => {
  if (canal !== undefined && pwmValue >= 0 && pwmValue <= 4095) {
    rpiplc.writePWM(canal, pwmValue);
    return Math.round(pwmValue);
  }
  return `⚠️ Canal PWM ${canal} no definido o duty inválido`;
};

// =======================
// Control PI discreto (con anti-windup, 12 bits PWM)
// =======================
const ejecutarControlPI = async ({
  canalAdc,
  canalPwm,
  setpoint_volt,
  tiempo_muestreo_ms,
  tiempo_simulacion_ms,
}) => {
  // console.log(
  //   `📡 Iniciando Control PI: ADC${canalAdc} → PWM${canalPwm}, SetPoint=${setpoint_volt}V, Ts=${tiempo_muestreo_ms}ms, Duración=${tiempo_simulacion_ms}ms`
  // );

  // Parámetros del controlador
  const Kp = 1.2;
  const Ti = 0.5049;
  const Ts = tiempo_muestreo_ms / 1000.0; // tiempo de muestreo en segundos

  let integralError = 0.0;
  let tiempoTranscurrido = 0;
  const fin = Date.now() + tiempo_simulacion_ms;
  const resultados = [];

  // Función interna del controlador PI
  function piController(error) {
    // Salida sin saturación
    let u = Kp * (error + (integralError / Ti));

    // Saturación
    if (u > 10.0) u = 10.0;
    if (u < 0.0) u = 0.0;

    // Anti-windup: integrar solo si no está saturado
    if (u > 0.0 && u < 10.0) {
      integralError += Ts * error;
    }

    return u;
  }

  // Bucle de control
  while (Date.now() < fin) {
    // 1️⃣ Leer ADC
    const conversion = await leerADC({ canal: canalAdc, tiempo: tiempoTranscurrido });

    // 2️⃣ Escalar a voltaje 0–10 V
    const voltage = (10.0 * conversion) / 4095.0;

    // 3️⃣ Calcular error
    const error = setpoint_volt - voltage;

    // 4️⃣ Aplicar controlador PI
    const controlVoltage = piController(error);

    // 5️⃣ Escalar salida a PWM 12 bits
    const valorPWM = Math.round((controlVoltage * 4095.0) / 10.0);

    // 6️⃣ Escribir salida PWM
    rpiplc.writePWM(canalPwm, valorPWM);
    // o: await escribirPWM({ canal: canalPwm, valorPWM });

    // 7️⃣ Guardar resultados
    resultados.push({
      tiempo: tiempoTranscurrido.toFixed(2),
      Voltaje: voltage.toFixed(2),
      error: error.toFixed(2),
      salidaPI: controlVoltage.toFixed(2),
      PWM: valorPWM,
    });

    // 8️⃣ Esperar siguiente muestreo
    tiempoTranscurrido += Ts;
    await new Promise((r) => setTimeout(r, tiempo_muestreo_ms));
  }

  return {
    Prueba: new Date().toISOString(),
    resultados,
  };
};
// =======================
// Caracterización del sistema
// =======================
const ejecutarCaracterizacion = async ({
  canalAdc = 0,
  canalPwm = 0,
  tiempo_muestreo_ms = 100,
  secuencia = [
    { porcentaje: 30, duracion_s: 20 },
    { porcentaje: 10, duracion_s: 30 },
  ],
}) => {
  const resultados = [];
  const Ts = tiempo_muestreo_ms / 1000; // segundos
  let tiempoTranscurrido = 0;

  //console.log(`⚙️ Iniciando caracterización secuencial PWM-ADC...`);

  for (const paso of secuencia) {
    const pwmObjetivo = Math.round((paso.porcentaje / 100) * 4095);
    const duracionPasoMs = paso.duracion_s * 1000;
    const inicioPaso = Date.now();
    const finPaso = inicioPaso + duracionPasoMs;

   // console.log(`➡️ Nivel ${paso.porcentaje}% (${pwmObjetivo}) durante ${paso.duracion_s}s`);

    // Mantiene el PWM constante en este nivel durante la duración especificada
    while (Date.now() < finPaso) {
      // 1️⃣ Escribir PWM
      rpiplc.writePWM(canalPwm, pwmObjetivo);
      // 2️⃣ Leer ADC
      const conversion = await leerADC({
        canal: canalAdc,
        tiempo: parseFloat(tiempoTranscurrido.toFixed(3)),
      });

      // 3️⃣ Escalar ADC a voltaje (0–10 V)
      const voltaje = (10.0 * conversion) / 4095.0;

      // 4️⃣ Guardar registro
      resultados.push({
        tiempo: parseFloat(tiempoTranscurrido.toFixed(3)),
        pwm: pwmObjetivo,
        voltaje: parseFloat(voltaje.toFixed(3)),
      });

      // 5️⃣ Esperar siguiente muestreo
      tiempoTranscurrido += Ts;
      await new Promise((r) => setTimeout(r, tiempo_muestreo_ms));
    }
  }

  // 🧾 Resultado final
  return {
    Prueba: new Date().toISOString(),
    resultados,
  };
};


// =======================

// =======================
// Exportación
// =======================
module.exports = {
  escribirSalida,
  leerEntrada,
  leerADC,
  ejecutarADC,
  escribirPWM,
  ejecutarControlPI,
  ejecutarCaracterizacion
};
