import crossfilter from 'crossfilter2';
import * as ss from 'simple-statistics'; // Para calcular cuantiles

function calcularRangosFD(consumos) {
  const n = consumos.length;
  if (n === 0) return { binWidth: 0, rangos: [] };

  const sorted = [...consumos].sort((a, b) => a - b);
  const q1 = ss.quantileSorted(sorted, 0.25);
  const q3 = ss.quantileSorted(sorted, 0.75);
  const iqr = q3 - q1;

  let binWidth = 2 * iqr * Math.pow(n, -1 / 3);
  if (!binWidth || binWidth <= 0) {
    binWidth = (sorted[n - 1] - sorted[0]) / (Math.log2(n) + 1);
  }

  const min = sorted[0];
  const max = sorted[n - 1];

  const rangos = [];
  for (let start = min; start < max; start += binWidth) {
    rangos.push({
      min: Math.round(start * 100) / 100,
      max: Math.round((start + binWidth) * 100) / 100
    });
  }

  return { binWidth, rangos };
}

export function rangosVariables(resultados, campo = 'Voltaje') {
  const cf = crossfilter(
    resultados.map(d => ({
      tiempo: parseFloat(d.tiempo),
      Voltaje: parseFloat(d.Voltaje),
      error: parseFloat(d.error)
    }))
  );

  const dim = cf.dimension(d => d[campo]);
  const valores = dim.top(Infinity).map(d => d[campo]);
  const { binWidth, rangos } = calcularRangosFD(valores);

  const resultadoRangos = rangos.map(r => {
    const items = dim.top(Infinity).filter(d => d[campo] >= r.min && d[campo] < r.max);
    return { ...r, items };
  });

  resultadoRangos.sort((a, b) => a.min - b.min);

  return { binWidth, rangos: resultadoRangos };
}
