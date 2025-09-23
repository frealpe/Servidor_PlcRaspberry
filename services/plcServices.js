// services/plcService.js
const plc = require("../rpiplc-addon/build/Release/rpiplc");
const { PINES } = require("./helpers");

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

module.exports = { escribirSalida, leerEntrada };
