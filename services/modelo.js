const coeficientes = {
  a1: 0.765,
  b0: 0.192,
  b1: 0.043
};

let y_1 = 0.6205128205128205;
let u_1 = 0.599853515625;

function modeloPlanta(u) {
  const y = coeficientes.a1 * y_1 + coeficientes.b0 * u + coeficientes.b1 * u_1;
  y_1 = y;
  u_1 = u;
  return y;
}

module.exports = { modeloPlanta, coeficientes };