const { Schema, model } = require('mongoose')

const DispositivoSchema = Schema({

    proyecto:{
        type: Schema.Types.ObjectId,
        ref:'Proyecto',
        require: true,
    },
    
    nivelbateria: {
        type: String,
    },        
    
    rssi: {
        type: String,
    },  
    
    varc1: {
        type: String,
    },  

    varc2: {
        type: String,
    },  

    varc3: {
        type: String,
    },  

    varc4: {
        type: String,
    },  

    alarmas: {
        type: String,
    },  

    downlink: {
        type: String,
    },  


});

DispositivoSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Dispositivo',DispositivoSchema);