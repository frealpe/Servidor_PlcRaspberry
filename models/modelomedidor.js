const { Schema, model } = require('mongoose')

const ModeloMedidorSchema = Schema({

    marca:{
        type: Schema.Types.ObjectId,  
        ref: 'MarcaMedidor',  
    },
    
    nombre: {
        type: String,
        require: [true, 'El nombre del modelo es Obligatorio'],
        unique: true
    },        



});

ModeloMedidorSchema .methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('ModeloMedidor',ModeloMedidorSchema );