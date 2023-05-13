const { Schema, model } = require("mongoose");

const MediciondSchema = Schema({
  dispositivo: {
    type: Schema.Types.ObjectId,
    ref: "Dispositivo",
    require: true,
  },

  time: {
    type: Date,
    require: true,
  },
  nivelbateria: {
    type: String,
  },

  rssi: {
    type: String,
  },

  varc1: {
    type: String,
  },

  varc2: {
    type: String,
  },

  varc3: {
    type: String,
  },

  varc4: {
    type: String,
  },

  alarmas: {
    type: String,
  },

  downlink: {
    type: String,
  },
});

MediciondSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
};

module.exports = model("Mediciond", MediciondSchema);
