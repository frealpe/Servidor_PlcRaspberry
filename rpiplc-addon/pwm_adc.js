// test_rpiplc.js
const rpiplc = require('./build/Release/rpiplc'); // Ajusta ruta si es diferente

console.log('=== PRUEBA DIGITAL ===');
const pinDigital = 0; // Cambia según tu modelo

console.log(`Encendiendo pin ${pinDigital}...`);
let res = rpiplc.writeDigital(pinDigital, 1);
console.log('Resultado WriteDigital:', res);

console.log(`Leyendo pin ${pinDigital}...`);
res = rpiplc.readDigital(pinDigital);
console.log('Resultado ReadDigital:', res);

console.log('\n=== PRUEBA ADC ===');
const adcValue = rpiplc.readADC();
if (adcValue < 0) {
    console.log('Error leyendo ADC. ¿Tienes entradas analógicas conectadas?');
} else {
    console.log('Valor ADC [0]:', adcValue);
}

console.log('\n=== PRUEBA PWM ===');
const pwmDuty = 128; // 0-255
console.log(`Escribiendo PWM con duty ${pwmDuty}...`);
res = rpiplc.writePWM(pwmDuty);
console.log('Resultado WritePWM:', res);

console.log('Lectura PWM no disponible directamente, verifica salida con osciloscopio o LED.');
