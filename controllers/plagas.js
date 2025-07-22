const { response } = require("express");
const { Plagas, Proyecto } = require("../models");
const mongoose = require("mongoose");

// Crear nuevo registro de plagas
const crearPlaga = async (req, res = response) => {
  try {
    const {
      uid,
      fecha,
      fechaIntervencion,
      observaciones,
      responsable,
      registro
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({
        ok: false,
        msg: 'ID de proyecto no válido.',
      });
    }

    const proyecto = await Proyecto.findById(uid);
    if (!proyecto) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró un proyecto con ese ID.',
      });
    }

    const nuevaPlaga = new Plagas({
      proyecto: uid,
      fecha,
      fechaIntervencion,
      observaciones,
      responsable,
      registro,
    });
    // console.log(nuevaPlaga);
    await nuevaPlaga.save();

    res.status(201).json({
      ok: true,
      msg: 'Registro de plagas creado correctamente',
      plaga: nuevaPlaga,
    });
  } catch (error) {
    console.error('❌ Error al crear registro de plagas:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno del servidor',
    });
  }
};

// Obtener registros de plagas por proyecto
const obtenerPlagas = async (req, res = response) => {
  const { id } = req.params;

  try {
    const registros = await Plagas.find({ proyecto: id });

    const registrosConvertidos = registros.map((r) => {
      const registroPlano = {};

      // Convertimos el Map a objeto plano
      for (const [key, value] of r.registro.entries()) {
        registroPlano[key] = value;
      }

      return {
        id: r._id,
        fecha: r.fecha,
        fechaIntervencion: r.fechaIntervencion,
        observaciones: r.observaciones,
        responsable: r.responsable,
        proyecto: r.proyecto,
        registro: registroPlano,
      };
    });

    res.json({
      ok: true,
      total: registros.length,
      registros: registrosConvertidos,
    });
  } catch (error) {
    console.error('❌ Error al obtener registros de plagas:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al consultar registros',
    });
  }
};


module.exports = {
  crearPlaga,
  obtenerPlagas,
};
