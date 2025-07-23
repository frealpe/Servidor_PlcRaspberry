const { response } = require("express");
const { Muestra } = require("../models");
const mongoose = require("mongoose");

// Crear nuevo registro de muestra
const crearMuestra = async (req, res = response) => {
  try {
    const { proyecto, geoInstalacion, numeromuestra } = req.body;

    // Verificar que el proyecto sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(proyecto)) {
      return res.status(400).json({
        msg: 'ID de proyecto no válido'
      });
    }

    // Crear nueva muestra
    const muestra = new Muestra({
      proyecto,
      geoInstalacion,
      numeromuestra
    });

    // Guardar en BD
    await muestra.save();

    res.status(201).json({
      msg: 'Muestra creada correctamente',
      muestra
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
      error: error.message
    });
  }
};

// Obtener todas las muestras
const obtenerMuestras = async (req, res = response) => {
  try {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, muestras] = await Promise.all([
      Muestra.countDocuments(query),
      Muestra.find(query)
        .populate('proyecto', 'nombre descripcion') // Popula la referencia al proyecto
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
      total,
      muestras
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
      error: error.message
    });
  }
};

// Obtener una muestra por ID
const obtenerMuestraPorId = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: 'ID no válido'
      });
    }

    const muestra = await Muestra.findById(id)
      .populate('proyecto', 'nombre descripcion');

    if (!muestra) {
      return res.status(404).json({
        msg: 'Muestra no encontrada'
      });
    }

    res.json({
      muestra
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
      error: error.message
    });
  }
};

// Actualizar una muestra
const actualizarMuestra = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { proyecto, geoInstalacion, numeromuestra, ...resto } = req.body;

    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: 'ID no válido'
      });
    }

    // Verificar que el proyecto sea un ObjectId válido (si se proporciona)
    if (proyecto && !mongoose.Types.ObjectId.isValid(proyecto)) {
      return res.status(400).json({
        msg: 'ID de proyecto no válido'
      });
    }

    // Preparar datos a actualizar
    const data = { ...resto };
    if (proyecto) data.proyecto = proyecto;
    if (geoInstalacion) data.geoInstalacion = geoInstalacion;
    if (numeromuestra) data.numeromuestra = numeromuestra;

    const muestra = await Muestra.findByIdAndUpdate(id, data, { new: true })
      .populate('proyecto', 'nombre descripcion');

    if (!muestra) {
      return res.status(404).json({
        msg: 'Muestra no encontrada'
      });
    }

    res.json({
      msg: 'Muestra actualizada correctamente',
      muestra
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
      error: error.message
    });
  }
};

// Eliminar una muestra (eliminación lógica)
const eliminarMuestra = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: 'ID no válido'
      });
    }

    // Eliminación lógica (cambiar estado a false)
    const muestra = await Muestra.findByIdAndUpdate(id, { estado: false }, { new: true });

    if (!muestra) {
      return res.status(404).json({
        msg: 'Muestra no encontrada'
      });
    }

    res.json({
      msg: 'Muestra eliminada correctamente',
      muestra
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
      error: error.message
    });
  }
};

module.exports = {
  crearMuestra,
  obtenerMuestras,
  obtenerMuestraPorId,
  actualizarMuestra,
  eliminarMuestra
};