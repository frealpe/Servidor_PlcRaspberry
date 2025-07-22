const { response } = require('express')
const mongoose = require('mongoose')
const {Proyecto,Riego}= require('../models')

// 🎯 Crear nuevo registro de riego
const crearRiego = async (req, res = response) => {
  // console.log('Entre');
  try {
    const {
      fecha,
      lote,
      sistema,
      numeroPlantas,
      requerimientoArbol,
      tiempoRiego,
      descargaDifusor,
      aguaTotalLitros,
      observaciones,
      uid, // ID del proyecto
    } = req.body

    // Validación básica del ID del proyecto
    if (!mongoose.isValidObjectId(uid)) {
      return res.status(400).json({
        ok: false,
        msg: 'El ID del proyecto no es válido.',
      })
    }

    // Verificación de existencia del proyecto
    const proyecto = await Proyecto.findById(uid)
    if (!proyecto) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró un proyecto con ese ID. No se puede guardar el riego.',
      })
    }

    // Crear nueva instancia del documento Riego
    const nuevoRiego = new Riego({
      fecha: new Date(fecha),
      lote,
      sistema: sistema?.trim(),
      numeroPlantas,
      requerimientoArbol,
      tiempoRiego,
      descargaDifusor,
      aguaTotalLitros,
      observaciones: observaciones?.trim() || 'Ninguno',
      proyecto: uid,
    })
    // console.log(nuevoRiego);
    // Guardar en base de datos
    await nuevoRiego.save()

    return res.status(201).json({
      ok: true,
      msg: 'Riego registrado exitosamente',
      riego: nuevoRiego,
    })
  } catch (error) {
    console.error('Error al guardar riego:', error)
    return res.status(500).json({
      ok: false,
      msg: 'Error interno al guardar el riego',
    })
  }
}

// 📦 Obtener riegos por proyecto
const obtenerRiegos = async (req, res = response) => {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      ok: false,
      msg: 'ID de proyecto inválido',
    })
  }

  try {
    const riegos = await Riego.find({ proyecto: id }).sort({ fecha: -1 })

    res.json({
      ok: true,
      total: riegos.length,
      riegos,
    })
  } catch (error) {
    console.error('Error al cargar riegos:', error)
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener riegos',
    })
  }
}

module.exports = {
  crearRiego,
  obtenerRiegos,
}
