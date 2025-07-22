const { Schema, model } = require('mongoose')

const RegistroArbolSchema = new Schema({
  trips: { type: String, default: '0' },
  moscaOvario: { type: String, default: '0' },
  acaros: { type: String, default: '0' },
  otrosInsectos: { type: String, default: '0' },
  botrytis: { type: String, default: '0' },
  phomosis: { type: String, default: '0' },
  roña: { type: String, default: '0' },
  otrosHongos: { type: String, default: '0' },
  fusarium: { type: String, default: '0' }
}, { _id: false })

const PlagaSchema = Schema({
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  fechaIntervencion: {
    type: Date
  },
  observaciones: {
    type: String
  },
  responsable: {
    type: String
  },
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'El proyecto es obligatorio']
  },
  registro: {
    type: Map,
    of: RegistroArbolSchema,
    required: true
  }
})

// Personaliza la salida JSON (elimina __v y convierte _id en id)
PlagaSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject()
  data.id = _id
  return data
}

module.exports = model('Plaga', PlagaSchema)
