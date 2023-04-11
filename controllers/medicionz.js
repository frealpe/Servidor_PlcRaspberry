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
        purchasegasgross:req.body.purchasegasgross,        
        pulsebreak: req.body.pulsebreak,
        workcumulunt:req.body.workcumulunt,        
        batterymillivolt:req.body.batterymillivolt,        
        isshock:req.body.isshock,        
        sparebatterymillivolt:req.body.sparebatterymillivolt,                                
        reederr:req.body.reederr,        
        disassemble:req.body.disassemble,
        ljoutlimitsfailure:req.body.ljoutlimitsfailure,
        isflowexception:req.body.isflowexception,
        temperature:req.body.temperature,
        isbatterybad:req.body.isbatterybad,
        isrevealgas:req.body.isrevealgas,
        isckqvclose:req.body.isckqvclose,
        isvalveerr:req.body.isvalveerr,
        powerfailure:req.body.powerfailure,
        arrearsclosevalue:req.body.arrearsclosevalue,
        iswycgqfault:req.body.iswycgqfault,
        isvalveclose:req.body.isvalveclose,
        iscommunicatebad:req.body.iscommunicatebad,
        isinnerbaterr:req.body.isinnerbaterr,
        signalintensity:req.body.signalintensity,
        isremoteclosevalve:req.body.isremoteclosevalve,
        ismagneticdisturbance:req.body.ismagneticdisturbance,  
        scrapfailure:req.body.scrapfailure,  
        alarmclosevalue:req.body.alarmclosevalue,  
        securitycheckfailure:req.body.securitycheckfailure,  
        reportmode:req.body.reportmode,        
        remaindergasamount:req.body.remaindergasamount,        

        


    }
    const Medicionzd = new Medicionz(data);
    await Medicionzd.save();
    res.status(201).json(Medicionzd);
}

module.exports = {
    obtenerMedicionz,
    crearMedicionz,
}