const { Schema, model } = require('mongoose')

const DispositivoSchema = Schema({

    proyecto:{
        type: Schema.Types.ObjectId,
        ref:'Proyecto',
        require: true,
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref:'Cliente',
        require: true,
    },        

    medidor:{
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el operador al proyecto
        ref: 'Medidor',             //El operador del proyecto
        require: true

    },   

    iddispositivo: {
        type: String,    //Lo usamos para relacionar el operador al proyecto
        require: true
    },

    matricula:{
        type: String,        
        require: true      
    },

    direccion:{
        type: String,        
        require: true      
    },

    georeferencia:{
        type: String,        
        require: true      
    }    


});

DispositivoSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Dispositivo',DispositivoSchema);