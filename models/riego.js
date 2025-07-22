const { Schema, model } = require('mongoose');

const RiegoSchema = Schema({
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  lote: {
    type: Number,
    required: [true, 'El lote es obligatorio']
  },
  sistema: {
    type: String,
    required: [true, 'El sistema de riego es obligatorio']
  },
  numeroPlantas: {
    type: Number,
    required: [true, 'El número de plantas es obligatorio']
  },
  requerimientoArbol: {
    type: Number,
    required: [true, 'El requerimiento por árbol (L) es obligatorio']
  },
  tiempoRiego: {
    type: Number,
    required: [true, 'El tiempo de riego (min) es obligatorio']
  },
  descargaDifusor: {
    type: Number,
    required: [true, 'La descarga por difusor (L) es obligatoria']
  },
  aguaTotalLitros: {
    type: Number,
    required: [true, 'El total de agua aplicada (L) es obligatorio']  
  },
  observaciones: {
    type: String,
    default: ''
  },
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'El proyecto es obligatorio'] 
  }
})

// Personaliza el toJSON
RiegoSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject()
  data.id = _id
  return data
}

module.exports = model('Riego', RiegoSchema)
