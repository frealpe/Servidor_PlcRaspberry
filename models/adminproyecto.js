const { Schema, model } = require("mongoose");

const AdminProyectoSchema = Schema({
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: "Proyecto",
  },

  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
});

AdminProyectoSchema.virtual('user', {
  ref: 'Usuario',
  localField: 'usuario',
  foreignField: '_id',
  justOne: true,
});

AdminProyectoSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
};

module.exports = model("AdminProyecto", AdminProyectoSchema);
