const { response } = require("express");
const { LaborDiaria, Proyecto } = require("../models");
const mongoose = require("mongoose");
/////////////////////////////////////////////////////////////////////////////////////
// Obtener todas las labores
const obtenerLabores = async (req, res = response) => {
  try {
    const { id } = req.params;

     const labores = await LaborDiaria.find({ proyecto: id }); 
    //  console.log('Labores obtenidas:', labores);
    res.json({labores });

  } catch (error) {
    console.error('Error al obtener labores del proyecto:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener las labores del proyecto',
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////
// Obtener una labor por ID
const obtenerLabor = async (req, res = response) => {
  const { id } = req.params;

  // Validar ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, msg: 'ID de labor no válido' });
  }

  try {
    const labor = await LaborDiaria.findById(id).populate('proyecto', 'nombre');

    if (!labor) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró una labor con el ID: ${id}`
      });
    }

    res.json({ ok: true, labor });
  } catch (error) {
    console.error('Error al obtener labor:', error);
    res.status(500).json({ ok: false, msg: 'Error interno al buscar la labor' });
  }
};

// Crear una nueva labor
const crearLabor = async (req, res = response) => {
  try {
    const {
      fecha,
      laborRealizada,
      numeroJornales,
      costoJornales,
      insumosYMateriales = [],
      costoTotal,
      observaciones = '',
      uid,
    } = req.body;

    // Validar ID de proyecto
    if (!mongoose.isValidObjectId(uid)) {
      return res.status(400).json({
        ok: false,
        msg: 'El ID del proyecto no es válido.',
      });
    }

    // Verificar existencia del proyecto
    const proyecto = await Proyecto.findById(uid);
    if (!proyecto) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró un proyecto con ese ID. No se puede guardar la labor.',
      });
    }

    // Crear nueva labor
    const nuevaLabor = new LaborDiaria({
      fecha,
      laborRealizada: laborRealizada?.trim(),
      numeroJornales,
      costoJornales,
      insumosYMateriales,
      costoTotal,
      observaciones: observaciones?.trim(),
      proyecto: uid,
    });

    await nuevaLabor.save();

    return res.status(201).json({
      ok: true,
      msg: 'Labor diaria guardada exitosamente',
      labor: nuevaLabor,
    });

  } catch (error) {
    console.error('Error al guardar labor:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error interno al guardar la labor diaria',
    });
  }
};

// Actualizar una labor existente
const actualizarLabor = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;


  console.log(id);
  console.log(data);
  // Validar ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, msg: 'ID de labor no válido' });
  }

  if (data.fecha) {
    data.fecha = new Date(data.fecha);
  }

  try {
    const laborActualizada = await LaborDiaria.findByIdAndUpdate(id, data, { new: true });

    if (!laborActualizada) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró una labor con el ID: ${id}`,
      });
    }

    res.json({
      ok: true,
      msg: 'Labor actualizada correctamente',
      labor: laborActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar labor:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno al actualizar la labor',
    });
  }
};

// Eliminar una labor
const borrarLabor = async (req, res = response) => {
  const { id } = req.params;

  // Validar ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, msg: 'ID de labor no válido' });
  }

  try {
    const laborEliminada = await LaborDiaria.findByIdAndRemove(id);

    if (!laborEliminada) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró una labor con el ID: ${id}`,
      });
    }

    res.json({
      ok: true,
      msg: 'Labor eliminada correctamente',
      labor: laborEliminada,
    });
  } catch (error) {
    console.error('Error al eliminar labor:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno al eliminar la labor',
    });
  }
};

module.exports = {
  obtenerLabores,
  obtenerLabor,
  crearLabor,
  actualizarLabor,
  borrarLabor
};
