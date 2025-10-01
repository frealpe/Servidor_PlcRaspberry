//const rpiplc = require("../rpiplc-addon/build/Release/rpiplc");
const { PINES } = require("./helpers");

// =======================
// Escritura digital
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
const leerADC = async (canal) => {
  if (canal !== undefined) {
    // Simulación de valor ADC con número aleatorio de 0 a 1023
    const adcValue = Math.floor(Math.random() * 1024);
    //console.log(adcValue);
    return adcValue;
  }
  return null;
};

// =======================
// Lectura periódica de ADC
// =======================
const ejecutarADC = async ({canal, muestreo, duracion}) => {
  const fin = Date.now() + duracion;
  const resultados = [];
  //console.log(`Iniciando lectura ADC en canal ${canal} cada ${muestreo}ms por ${duracion}ms`);
  while (Date.now() < fin) {
    const valor = await leerADC(canal);
    resultados.push(valor);
    await new Promise((r) => setTimeout(r, muestreo));
  }

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
    let valorADC = await leerADC(canalAdc);
    if (valorADC < 0) valorADC = 0;

    // 2️⃣ Convertir a voltaje 0–10V
    const voltage = (10.0 * valorADC) / 4095;

    // 3️⃣ Calcular error PI
    const error = setpoint_volt - voltage;
    integralError += Ts * error;
    let controlVoltage = kp * (error + (1.0 / Ti) * integralError);

    // 4️⃣ Limitar salida PI entre 0 y 10V
    controlVoltage = Math.min(Math.max(controlVoltage, 0), 10);

    // 5️⃣ Escalar control a PWM 12-bit
    const valorPWM = Math.round((controlVoltage / 10) * 4095);
    escribirPWM(canalPwm, valorPWM);

    // Crear JSON con la info
    const dato = {
      tiempo: tiempoTranscurrido.toFixed(2),
      Adc: valorADC,
      Voltaje: voltage.toFixed(2),
      Control_V: controlVoltage.toFixed(2),
      Pwm: valorPWM,
    };

    resultados.push(dato); // guardar en el array

    tiempoTranscurrido += Ts;
    await new Promise((r) => setTimeout(r, tiempo_muestreo_ms));
  }

  // 👇 Estructura final
  return {
    Prueba: new Date().toISOString(),
    Datos: resultados
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
