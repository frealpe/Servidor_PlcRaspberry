const { Schema, model } = require('mongoose')

const PuntoSchema = Schema({

    idcliente: {
        type: String,
        require: [true, 'El id es Obligatorio'],
        unique: true
    },        
    nombre: {
        type: String,        
        require: true
    },
    dispositivo: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el operador al proyecto
        ref: 'Dispositivo',                //El operador del proyecto
        require: true
    },

});

PuntoSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Punto',PuntoSchema);