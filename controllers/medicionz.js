const { response } = require("express");
const {Medicionz, Dispositivo} = require('../models');


//Obtener Medicionzes - por id populate ()
const obtenerMedicionz = async (req, res = response) => {

    const {id} = req.params;
    const Medicionzs = await Medicionz.findById(id);
    res.json({
        Medicionzs
    }); 
}

//Crear una Medicionzes 
const crearMedicionz = async (req, res = response) => {   
    
    const dipositivo = req.body.dispositivo;    

    const MedicionzesDB = await Dispositivo.findOne({dipositivo});
    if (!MedicionzesDB) {
        return res.status(400).json({
            msg: `El Dispositivo ${dipositivo},no existe`
        });
    }  
    const data = {
        dispositivo:req.body.dispositivo,
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
    const Medicionzd = new Medicionz(data);
    await Medicionzd.save();
    res.status(201).json(Medicionzd);
}

module.exports = {
    obtenerMedicionz,
    crearMedicionz,
}