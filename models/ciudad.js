const { Schema, model } = require('mongoose')

const CiudadSchema = Schema({

    codigoDepartamento:{
        type: String,
    },    

    departamento:{
        type: String,
    },   

    codigoMunicipio:{
        type: String,
        require: [true, 'El codigo es obligatorio'],
        unique: true
    }, 
    
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
    },    

});
CiudadSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Ciudad',CiudadSchema);

