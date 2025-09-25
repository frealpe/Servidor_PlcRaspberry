// services/plcService.js
const plc = require("../rpiplc-addon/build/Release/rpiplc");
const { PINES,ADC_CHANNELS } = require("./helpers");
const OpcServices = require("./OpcServices");

const escribirSalida = (pin, valor) => {
  const pinNumber = pin.replace("Q", "");
  if (PINES[pinNumber] !== undefined && (valor === 0 || valor === 1)) {
    plc.writeDigital(PINES[pinNumber], valor);
    return `✅ Salida ${pin} configurada en ${valor}`;
  }
  return `⚠️ Pin ${pin} no definido o valor inválido`;
};

const leerEntrada = (pin) => {
  const pinNumber = pin.replace("I", "");
  if (PINES[pinNumber] !== undefined) {
    const valor = plc.readDigital(PINES[pinNumber]);
    return `📥 Entrada ${pin} leída: ${valor}`;
  }
  return `⚠️ Pin ${pin} no definido en la tabla`;
};

// =======================
// Lectura de ADC
// =======================
// Función que hace lecturas periódicas del ADC
const ejecutarADC = async (canal, intervalo = 1000, duracion = 5000) => {
  const fin = Date.now() + duracion;
  const resultados = [];

  while (Date.now() < fin) {
    const valor = await leerADC(canal); // lee y publica en OPC UA
    resultados.push(valor);

    await new Promise(r => setTimeout(r, intervalo));
  }

  return resultados.join("\n");
};

// Función de lectura simulada del ADC
const leerADC = async (canal) => {
  if (ADC_CHANNELS[canal] !== undefined) {
    // Valor dinámico entre 0 y 255
   // const valor = Math.floor(Math.random() * 256);
    const adcValue = plc.readADC(ADC_CHANNELS[canal]);
    console.log("Valor leído:", adcValue);

    // Publicar en OPC UA
    await OpcServices.writeADC(adcValue);

    return `📊 ADC[${canal}] = ${adcValue}`;
  }
  return `⚠️ Canal ADC ${canal} no definido`;
};
// =======================
// Escritura de PWM
// =======================
const escribirPWM = (canal, duty) => {
  // if (PWM_CHANNELS[canal] !== undefined && duty >= 0 && duty <= 255) {
  //   plc.writePWM(PWM_CHANNELS[canal], duty);
  //   return `✅ PWM[${canal}] configurado en duty ${duty}`;
  // }
  return `⚠️ Canal PWM ${canal} no definido o duty inválido`;
};



module.exports = { escribirSalida, leerEntrada,leerADC,escribirPWM,ejecutarADC };
