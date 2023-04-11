const { Schema, model } = require('mongoose')

const MedicionzSchema = Schema({

    dispositivo:{
        type: Schema.Types.ObjectId,
        ref:'Dispositivo',
        require: true,
    },

    fecha:{
        type: String,
    },

    purchasegasgross:{
        type: String,
    },

    pulsebreak:{
        type: String,
    },

    workcumulunt:{
        type: String,
    },

    batterymillivolt:{
        type: String,
    },
    
    isshock:{
        type: String,
    },
    
    sparebatterymillivolt:{
        type: String,
    },
    
    reederr:{
        type: String,
    },
    
    istilt:{
        type: String,
    },
    
    disassemble:{
        type: String,
    },
    
    ljoutlimitsfailure:{
        type: String,
    },
    
    isflowexception:{
        type: String,
    },
    
    price:{
        type: String,
    },
    
    temperature:{
        type: String,
    },
 
    isbatterybad:{
        type: String,
    },
    isrevealgas:{
        type: String,
    },
    isckqvclose:{
        type: String,
    },
    isvalveerr:{
        type: String,
    },
    powerfailure:{
        type: String,
    },
    diemeter:{
        type: String,
    },
    arrearsclosevalue:{
        type: String,
    },
    iswycgqfault:{
        type: String,
    },

    isckqkf:{
        type: String,
    },
    pressure:{
        type: String,
    },
    isvalveclose:{
        type: String,
    },
    iscommunicatebad:{
        type: String,
    },
    isinnerbaterr:{
        type: String,
    },
    signalintensity:{
        type: String,
    },
    isremoteclosevalve:{
        type: String,
    },
    ismagneticdisturbance:{
        type: String,
    },
    scrapfailure:{
        type: String,
    },
    alarmclosevalue:{
        type: String,
    },
    securitycheckfailure:{
        type: String,
    },
    reportmode:{
        type: String,
    },
    remaindergasamount:{
        type: String,
    },


});

MedicionzSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Medicionz',MedicionzSchema);