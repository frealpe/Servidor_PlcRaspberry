const { Schema, model } = require('mongoose')

const ClienteSchema = Schema({

    identificacion:{
        type: String,  
        require: [true, 'La identificacion es obligatoria'],
        unique: true            
    }, 

    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
    } 

});

ClienteSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Cliente',ClienteSchema);