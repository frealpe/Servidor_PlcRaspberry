const { response } = require("express");
const {Medicion} = require('../models');


//Obtener Mediciones - por id populate ()
const obtenerMedicion = async (req, res = response) => {

    const {id} = req.params;
    const Medicions = await Medicion.findById(id);
    res.json({
        Medicions
    }); 
}

//Crear una Mediciones 
const crearMedicion = async (req, res = response) => {   
    
    const dipositivo = req.body.dipositivo;    

    const MedicionesDB = await Medicion.findOne({dipositivo});
    console.log(MedicionesDB);
    if (!MedicionesDB) {
        return res.status(400).json({
            msg: `El Dispositivo ${dipositivo},no existe`
        });
    }  
    const data = {
        dipositivo:req.body.dipositivo,
        fecha:req.body.fecha,
        nivelbateria:req.body.nivelbateria,        
        rssi: req.body.rssi,
        varc1:req.body.varc1,        
        varc2:req.body.varc2,        
        varc3:req.body.varc3,        
        varc4:req.body.varc4,                                
        alarmas:req.body.alarmas,        
        downlink:req.body.downlink,        
    }
    const Mediciond = new Medicion(data);
    await Mediciond.save();
    res.status(201).json(Mediciond);
}


module.exports = {

    obtenerMedicion,
    crearMedicion,
}