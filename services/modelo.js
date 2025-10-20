const coeficientes = {
  a1: 0.320,
  b0: 0.342,
  b1: 0.231
};

let y_1 = 0.3548229548229548;
let u_1 = 0.39990234375;

function modeloPlanta(u) {
  const { a1, b0, b1 } = coeficientes;
  const y = a1 * y_1 + b0 * u + b1 * u_1;
  y_1 = y;
  u_1 = u;
  return y;
}

module.exports = { modeloPlanta, coeficientes };