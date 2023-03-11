const { Schema, model } = require('mongoose')

const CiudadSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },    


});

CiudadSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Ciudad',CiudadSchema);