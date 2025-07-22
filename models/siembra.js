const { Schema, model } = require('mongoose');

const SiembraSchema = Schema({

  fechaSiembra: {
    type: Date,
    required: [true, 'La fecha de siembra es obligatoria']
  },

  lote: {
    type: Number,
    required: [true, 'El lote es obligatorio']
  },

  variedad: {
    type: String,
    required: [true, 'La variedad es obligatoria']
  },

  patron: {
    type: String,
    required: [true, 'El patrón es obligatorio']
  },

  proveedorMaterial: {
    type: String,
    required: [true, 'El proveedor del material de siembra es obligatorio']
  },

  numeroPlantulasSembradas: {
    type: Number,
    required: [true, 'El número de plántulas sembradas es obligatorio']
  },

  numeroSiembraNueva: {
    type: Number,
    default: 0
  },

  numeroResiembra: {
    type: Number,
    default: 0
  },

  distanciaSiembra: {
    calle: {
      type: Number,
      required: [true, 'La distancia entre calles es obligatoria']
    },
    plantas: {
      type: Number,
      required: [true, 'La distancia entre plantas es obligatoria']
    }
  },

  operarioEncargado: {
    type: String,
    required: [true, 'El nombre del operario es obligatorio']
  },
  
    proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'El proyecto es obligatorio']
  }

});

// Personaliza la salida JSON
SiembraSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
};

module.exports = model('Siembra', SiembraSchema);
