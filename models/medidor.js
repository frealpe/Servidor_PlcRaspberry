const { Schema, model } = require('mongoose')

const MedidorSchema = Schema({

   
    serie: {
        type: String,
        require: [true, 'La serie es Obligatoria'],
        unique: true
    },        

    marca: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el operador al proyecto
        ref: 'MarcaMedidor',             //El operador del proyecto
        require: true
    },

    modelo: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el operador al proyecto
        ref: 'ModeloMedidor',             //El operador del proyecto
        require: true
    },


    tipo: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el operador al proyecto
        ref: 'TipoMedidor',             //El operador del proyecto
        require: true
    },


});

MedidorSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject(); 
    data.id=_id;
    return data;
}

module.exports = model('Medidor',MedidorSchema);