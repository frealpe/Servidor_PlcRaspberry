const { response } = require('express');
const { Siembra, Proyecto } = require('../models');
const mongoose = require('mongoose');

// Obtener todas las siembras por proyecto
const obtenerSiembras = async (req, res = response) => {
  try {
    const { id } = req.params;

    const siembras = await Siembra.find({ proyecto: id });
    res.json({ siembras });

  } catch (error) {
    console.error('Error al obtener siembras del proyecto:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener las siembras del proyecto',
    });
  }
};

// Obtener una siembra por ID
const obtenerSiembra = async (req, res = response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, msg: 'ID de siembra no válido' });
  }

  try {
    const siembra = await Siembra.findById(id).populate('proyecto', 'nombre');

    if (!siembra) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró una siembra con el ID: ${id}`,
      });
    }

    res.json({ ok: true, siembra });
  } catch (error) {
    console.error('Error al obtener siembra:', error);
    res.status(500).json({ ok: false, msg: 'Error interno al buscar la siembra' });
  }
};

// Crear una nueva siembra
const crearSiembra = async (req, res = response) => {
  // console.log('Entre');
  try {
    const {
      fechaSiembra,
      lote,
      variedad,
      patron,
      proveedorMaterial,
      numeroPlantulasSembradas,
      numeroSiembraNueva = 0,
      numeroResiembra = 0,
      distanciaSiembra,
      operarioEncargado,
      uid, // ID del proyecto
    } = req.body;
    // console.log(req.body);

    if (!mongoose.isValidObjectId(uid)) {
      return res.status(400).json({
        ok: false,
        msg: 'El ID del proyecto no es válido.',
      });
    }

    const proyecto = await Proyecto.findById(uid);
    if (!proyecto) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró un proyecto con ese ID. No se puede guardar la siembra.',
      });
    }

    const nuevaSiembra = new Siembra({
      fechaSiembra: new Date(fechaSiembra),
      lote,
      variedad: variedad?.trim(),
      patron: patron?.trim(),
      proveedorMaterial: proveedorMaterial?.trim(),
      numeroPlantulasSembradas,
      numeroSiembraNueva,
      numeroResiembra,
      distanciaSiembra,
      operarioEncargado: operarioEncargado?.trim(),
      proyecto: uid,
    });

    // console.log('Documneto',nuevaSiembra);
    await nuevaSiembra.save();

    return res.status(201).json({
      ok: true,
      msg: 'Siembra guardada exitosamente',
      siembra: nuevaSiembra,
    });

  } catch (error) {
    console.error('Error al guardar siembra:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error interno al guardar la siembra',
    });
  }
};

// Actualizar una siembra
const actualizarSiembra = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, msg: 'ID de siembra no válido' });
  }

  if (data.fechaSiembra) {
    data.fechaSiembra = new Date(data.fechaSiembra);
  }

  try {
    const siembraActualizada = await Siembra.findByIdAndUpdate(id, data, { new: true });

    if (!siembraActualizada) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró una siembra con el ID: ${id}`,
      });
    }

    res.json({
      ok: true,
      msg: 'Siembra actualizada correctamente',
      siembra: siembraActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar siembra:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno al actualizar la siembra',
    });
  }
};

// Eliminar una siembra
const borrarSiembra = async (req, res = response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, msg: 'ID de siembra no válido' });
  }

  try {
    const siembraEliminada = await Siembra.findByIdAndRemove(id);

    if (!siembraEliminada) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró una siembra con el ID: ${id}`,
      });
    }

    res.json({
      ok: true,
      msg: 'Siembra eliminada correctamente',
      siembra: siembraEliminada,
    });
  } catch (error) {
    console.error('Error al eliminar siembra:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno al eliminar la siembra',
    });
  }
};

module.exports = {
  obtenerSiembras,
  obtenerSiembra,
  crearSiembra,
  actualizarSiembra,
  borrarSiembra
};
