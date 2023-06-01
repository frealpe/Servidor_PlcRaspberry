const { Schema, model } = require('mongoose')

const DispositivoSchema = Schema({

    
    proyecto:{
        type: Schema.Types.ObjectId,
        ref:'Proyecto',
    },
    
    matricula:{
        type: String,              
    },

    cuentaContrato:{
        type: String,            
    },    

    cliente: {
        type: Schema.Types.ObjectId,    //Pendiente por mirar asociar telefono e información
        ref:'Cliente',
    },  
    
    direccionInstalacion:{
        type: String,  
    },

    geoInstalacion:{
        type: String,        
  
    }, 

    zonaInstalacion:{
        type: String, 

    },

    estrato:{
        type: String, 

    },

    categoria:{
        type: String, 
        default: "residencial"
    },

    ruta:{
        type: String,         
    },
    
    serieMedidor:{
        type: Schema.Types.ObjectId,    //Marca, Modelo y Tipo van en el medidor
        ref: 'Medidor',                 
        require: true,
        unique: true           
    },   

    serieIot: {
        type: String,    //Lo usamos para relacionar el operador al proyecto
        require: true,
        unique: true   
    },

    estadoInstalacion:{
        type: String,    //Lo usamos para relacionar el operador al proyecto
        default: "proyectado"
    },


    fechaInstalacion:{
        type: String,    //Lo usamos para relacionar el operador al proyecto
    },

    fechaActivacion:{
        type: String,    //Lo usamos para relacionar el operador al proyecto
    },

    fechaUltimoReporte:{
        type: String,    //Lo usamos para relacionar el operador al proyecto
    },

    ultimaMedicion:{
        type: String,    //Lo usamos para relacionar el operador al proyecto
    },
//TODO Crear y asociar un  nuevo modelo de Novedad dispositivo
//Fecha-Observacion-Usuario Plataforma que registra la novedad
    medicion:{
        type: Schema.Types.ObjectId,    
        ref: 'Medicion',                 
        //require: true
    },

        
});

DispositivoSchema.methods.toJSON = function () {
    const {__v,_id, ...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Dispositivo',DispositivoSchema);