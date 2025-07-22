const { Schema, model } = require('mongoose')

const DepartamentoSchema = Schema({
    codigoDepartamento:{
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true        
    },
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },    

});
DepartamentoSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Departamento',DepartamentoSchema);