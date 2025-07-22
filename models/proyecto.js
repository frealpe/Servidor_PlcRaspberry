const { Schema, model } = require('mongoose')

const ProyectoSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'El id es obligatorio'],        //id Piloto
        require: true
    },

    idPiloto: {
        type: String,
        require: [true, 'El id es obligatorio'],        //id Piloto
        require: true
    },

    operador: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el operador al proyecto
        ref: 'Operador',                //El operador del proyecto
        require: true
    },
        
    departamento: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar el departamento del proyecto
        ref: 'Departamento',            //Departamento donde funciona el proyecto
        require: true,
        },
   
    municipio: {
        type: Schema.Types.ObjectId,    //Lo usamos para relacionar la ciudad al proyecto
        ref: 'Municipio',                  //Ciudad donde funciona el proyecto
        require: true,
    }, 

    estado:{
       type: String,  
       require: true,
       default: "Proyectado"  
    },

    geoInstalacion: {
        type: String,
    },
    
    numeroplantulas:{
        type: String,  
        require: true, 
    },
   
    fechacreado:{
        type: String,  
        require: true,
     },    

});

ProyectoSchema.methods.toJSON = function () {
    const {__v,_id,...data } = this.toObject();
    data.id=_id;
    return data;
}

module.exports = model('Proyecto',ProyectoSchema);