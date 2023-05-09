const { Schema, model } = require('mongoose')

const MarcaMedidorSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'La marca es Obligatorio'],
        unique: true
    },        

});

MarcaMedidorSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('MarcaMedidor',MarcaMedidorSchema);