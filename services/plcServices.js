const rpiplc = require("../rpiplc-addon/build/Release/rpiplc");
const { PINES } = require("./helpers");
const Sockets = require("../lib/socket");
// =======================
// Escritura digital
// =======================
const escribirSalida = ({ pin, valor }) => {
  if (pin !== undefined && (valor === 0 || valor === 1)) {
    rpiplc.writeDigital(PINES[pin], valor);
    console.log(`✅ Salida ${pin} configurada en ${valor}`);
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
  const resultados = [];
  const Ts = muestreo / 1000; // segundos
  let tiempoTranscurrido = 0;

  while (Date.now() < fin) {
    const tiempoActual = parseFloat(tiempoTranscurrido.toFixed(2));

    const conversion = leerADC({canal, tiempo: tiempoActual });
    resultados.push({
      canal,
      tiempo: tiempoActual,
      conversion,
    });
    tiempoTranscurrido += Ts;
    await new Promise((r) => setTimeout(r, muestreo));
  }

  return resultados;
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
// Exportación
// =======================
module.exports = {
  escribirSalida,
  leerEntrada,
  leerADC,
  ejecutarADC,
  escribirPWM,
  ejecutarControlPI,
};
