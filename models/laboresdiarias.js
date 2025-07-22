const { Schema, model } = require('mongoose');

const LaboresDiariaSchema = Schema({

  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },

  laborRealizada: {
    type: String,
    required: [true, 'La labor realizada es obligatoria']
  },

  numeroJornales: {
    type: Number,
    required: [true, 'El número de jornales es obligatorio']
  },

  costoJornales: {
    type: Number,
    required: [true, 'El costo de jornales es obligatorio']
  },

  insumosYMateriales: [{
    nombre: {
      type: String
    },
    costo: {
      type: Number
    }
  }],

  costoTotal: {   
    type: Number,
    required: [true, 'El costo total es obligatorio']
  },

  observaciones: {
    type: String,
    default: 'Ninguna'
  },

  proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'El proyecto es obligatorio']
  }
 
});

// Personaliza la salida JSON
LaboresDiariaSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
};

module.exports = model('LaboresDiaria', LaboresDiariaSchema);
