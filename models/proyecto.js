const { Schema, model } = require('mongoose')

const ProyectoSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },        
    ciudad: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar la ciudad al proyecto
        ref: 'Ciudad',                  //Ciudad donde funciona el proyecto
        require: true
    },
    operador: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el operador al proyecto
        ref: 'Operador',                //El operador del proyecto
        require: true
    },
    

});

ProyectoSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Proyecto',ProyectoSchema);