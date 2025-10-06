// =======================
// Escritura digital

const Sockets = require("../lib/socket");

// =======================
const escribirSalida = ({pin, valor}) => {
  if (pin !== undefined && (valor === 0 || valor === 1)) {
    // Simulación: randomiza si la escritura fue "exitosa" o no
    const simulated = Math.random() > 0.1; // 90% éxito, 10% fallo
    if (simulated) {
      console.log(`✅ (Simulado) Salida ${pin} configurada en ${valor}`);
      return `✅ (Simulado) Salida ${pin} configurada en ${valor}`;
    } else {
      console.log(`⚠️ (Simulado) Error al configurar salida ${pin}`);
      return `⚠️ (Simulado) Error al configurar salida ${pin}`;
    }
  }
  return `⚠️ Pin ${pin} no definido o valor inválido`;
};
// =======================
// Lectura digital
// ======================= 
const leerEntrada = (pin) => {
  if (pin !== undefined) {
    // Simulación: genera 0 o 1 de forma aleatoria
    const valor = Math.random() > 0.5 ? 1 : 0;
    console.log(`(Simulado) Entrada ${pin} leída: ${valor}`);
    return valor;
  }
  return `⚠️ Pin ${pin} no definido en la tabla`;
};


// =======================
// Lectura de ADC
// =======================
const leerADC = async ({ canal, tiempo }) => {
  //console.log("Canal:", canal);

  if (canal !== undefined) {
    // Simulación: valor ADC aleatorio entre 0 y 4095 (12 bits)
    const conversion = Math.floor(Math.random() * 4096);
    console.log(conversion);
    // Emitir al cliente WebSocket
    Sockets.enviarMensaje('adcPlc',{ canal, conversion, tiempo });

    return conversion;
  }

  return null;
};

// =======================
// Lectura periódica de ADC
// =======================
const ejecutarADC = async ({ canal, muestreo, duracion }) => {
  // console.log("⚙️ Ejecutando ADC...");
  // console.log(`➡️ canal=${canal}, muestreo=${muestreo}ms, duracion=${duracion}ms`);

  const fin = Date.now() + duracion;
  const resultados = [];
  const Ts = muestreo / 1000; // segundos
  let tiempoTranscurrido = 0;


  while (Date.now() < fin) {
    // Calcular tiempo actual
    const tiempoActual = parseFloat(tiempoTranscurrido.toFixed(2));
    //console.log("⏲️ Tiempo actual:", tiempoActual);

    // Llamar al ADC
    const conversion = await leerADC({canal, tiempo: tiempoActual });
    //console.log("🔹 Valor ADC:", valor);

    resultados.push({
      canal,
      tiempo: tiempoActual,
      conversion,
    });

    tiempoTranscurrido += Ts;
    // console.log("🧭 Tiempo transcurrido:", tiempoTranscurrido);

    await new Promise((r) => setTimeout(r, muestreo));
  }

  // console.log("✅ Finalizado. Total muestras:", resultados.length);
  return resultados;
};



// =======================
// Escritura de PWM
// =======================
const escribirPWM = (canal, duty) => {
  if (canal !== undefined && duty >= 0 && duty <= 4095) {
    const simulatedDuty = Math.floor(Math.random() * 4096);
    return simulatedDuty;
  }
  return `⚠️ Canal PWM ${canal} no definido o duty inválido`;
};

// =======================
// Control PI discreto (simulación real 12-bit PWM)
// =======================
const ejecutarControlPI = async ({ canalAdc, canalPwm, setpoint_volt, tiempo_muestreo_ms, tiempo_simulacion_ms }) => {
  console.log(`📡 Iniciando Control PI: ADC${canalAdc} → PWM${canalPwm}, SetPoint=${setpoint_volt}V, Ts=${tiempo_muestreo_ms}ms, Duración=${tiempo_simulacion_ms}ms`);

  let integralError = 0.0;
  const kp = 1.2;
  const Ti = 0.5049;
  const Ts = tiempo_muestreo_ms / 1000; // tiempo de muestreo en segundos
  const fin = Date.now() + tiempo_simulacion_ms;
  let tiempoTranscurrido = 0;

  const resultados = []; // aquí guardamos los JSON de cada iteración

  while (Date.now() < fin) {
    // 1️⃣ Leer ADC
    const conversion = await leerADC({canal:canalAdc,tiempo: tiempoTranscurrido});
    
    if (conversion < 0) conversion = 0;

    // 2️⃣ Convertir a voltaje 0–10V
    const voltage = (10.0 * conversion) / 4095;

    // 3️⃣ Calcular error PI
    const error = (setpoint_volt - voltage);
    integralError += Ts * error;
    let controlVoltage = kp * (error + (1.0 / Ti) * integralError);

    // 4️⃣ Limitar salida PI entre 0 y 10V
    controlVoltage = Math.min(Math.max(controlVoltage, 0), 10);

    // 5️⃣ Escalar control a PWM 12-bit
    const valorPWM = Math.round((controlVoltage / 10) * 4095);
    escribirPWM({canalPwm, valorPWM});

    // Crear JSON con la info
    const dato = {
      tiempo: tiempoTranscurrido.toFixed(2),
      Voltaje: voltage.toFixed(2),
      error: error.toFixed(2),
    };

    resultados.push(dato); // guardar en el array

    tiempoTranscurrido += Ts;
    await new Promise((r) => setTimeout(r, tiempo_muestreo_ms));
  }

  // 👇 Estructura final
  return {
    Prueba: new Date().toISOString(),
    resultados
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
