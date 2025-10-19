const coeficientes = {
  a1: 0.900,
  b0: 0.095,
  b1: 0.000
};

let y_1 = 0;
let u_1 = 0;

function modeloPlanta(u) {
  const y = coeficientes.a1 * y_1 + coeficientes.b0 * u + coeficientes.b1 * u_1;
  y_1 = y;
  u_1 = u;
  return y;
}

module.exports = { modeloPlanta, coeficientes };