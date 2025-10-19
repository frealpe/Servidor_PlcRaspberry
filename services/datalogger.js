require("dotenv").config();
const { dbConnection } = require("../database/config");

async function datalogger({ resultados }) {
  try {
    if (!resultados || resultados.length === 0) {
      console.warn("⚠️ No se encontraron datos para insertar");
      return;
    }

    const pool = dbConnection();
    const resultadosJson = JSON.stringify(resultados); // Convertimos a JSONB

    const query = `
      INSERT INTO DataLogger (resultado)
      VALUES ($1::jsonb)
      RETURNING id, prueba;
    `;

    const res = await pool.query(query, [resultadosJson]);

    console.log(`✅ Datos insertados con id: ${res.rows[0].id}, fecha: ${res.rows[0].prueba}`);

    return res.rows[0];

  } catch (error) {
    console.error("❌ Error al guardar en DataLogger:", error.message);
    if (error.detail) console.error("Detalle:", error.detail);
    throw error;
  }
}


async function guardarCaracterizacion({ resultado, Prueba }) {

  console.log("Resulatdo a guardar:", { resultado});
  console.log("Prueba a guardar:", { Prueba});

  if (!resultado || (Array.isArray(resultado) && resultado.length === 0)) {
    console.warn("⚠️ No se encontraron datos para insertar");
    return null;
  }

  const pool = dbConnection();

  try {
    const query = `
      INSERT INTO Caracterizacion (resultado, prueba)
      VALUES ($1::jsonb, $2)
      RETURNING id, prueba;
    `;
    const valores = [JSON.stringify(resultado), Prueba];

    const res = await pool.query(query, valores);

    console.log(`✅ Datos insertados con id: ${res.rows[0].id}, fecha: ${res.rows[0].prueba}`);

    return res.rows[0];
  } catch (error) {
    console.error("❌ Error al guardar en Caracterizacion:", error.message);
    if (error.detail) console.error("Detalle:", error.detail);
    throw error;
  } finally {
  }
}


module.exports = { datalogger,guardarCaracterizacion };  
