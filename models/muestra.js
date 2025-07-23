const { Schema, model } = require('mongoose');

const MuestraSchema = Schema({
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'El proyecto es obligatorio']
  },
  
  geoInstalacion: {
    type: String,
    required: true, 
  },
      
  numeromuestra: {
    type: String,  
    required: true, 
  },

  estado: {
    type: Boolean,
    default: true
  }
});

// Personaliza la salida JSON (elimina __v y convierte _id en id)
MuestraSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}

module.exports = model('Muestra', MuestraSchema);