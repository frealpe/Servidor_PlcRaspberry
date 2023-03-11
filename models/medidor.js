const { Schema, model } = require('mongoose')

const MedidorSchema = Schema({

    proyecto:{
        type: Schema.Types.ObjectId,
        ref:'Proyecto',
        require: true,
    },
    
    idmedidor: {
        type: String,
        require: [true, 'El id es Obligatorio'],
        unique: true
    },        
    tipomedidor: {
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