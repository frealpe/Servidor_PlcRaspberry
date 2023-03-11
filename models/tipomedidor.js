const { Schema, model } = require('mongoose')

const TipoMedidorSchema = Schema({

    denominacion: {
        type: String,
        require: [true, 'La denominacion es Obligatorio'],
        unique: true
    },        

});

TipoMedidorSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('TipoMedidor',TipoMedidorSchema);