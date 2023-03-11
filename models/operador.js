const { Schema, model } = require('mongoose')

const OperadorSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },    
    nit: {
        type: String,
        require: true,
        unique: true
    },

});

OperadorSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Operador',OperadorSchema);