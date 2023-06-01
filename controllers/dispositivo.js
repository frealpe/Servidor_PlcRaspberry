const { response } = require("express");
const {Dispositivo} = require('../models');

//Obtener Dispositivoes-Proyecto
const obtenerDispositivos = async (req, res = response) => {   
    
    const query = { estado: true };    
    const [totales, Dispositivos] = await Promise.all([
        //Dispositivo
        Dispositivo.countDocuments(query),
        Dispositivo.find(query).sort({serieMedidor:-1}),
    ]);
 
    res.json({
        totales,
        Dispositivos,
    }); 
}

//Obtener Dispositivoes - por id populate ()
const obtenerDispositivo = async (req, res = response) => {

    const {id} = req.params;
    const Dispositivos = await Dispositivo.findById(id);
    res.json({
        Dispositivos
    }); 
}

//Crear una Dispositivoes 
const crearDispositivo = async (req, res = response) => {   
    
    const serieMedidor = req.body.serieMedidor; 
    const DispositivoDB = await Dispositivo.findById(serieMedidor);
    if (DispositivoDB) {
        return res.status(400).json({
            msg: `El Dispositivo ${serieMedidor},ya existe`
        });
    }  
    const data = {
        serieMedidor:req.body.serieMedidor,
        serieIot:req.body.serieIot,
        fechaActivacion:req.body.fechaActivacion,        
        estadoInstalacion: req.body.estadoInstalacion,    
    }
    const Dispositivos = new Dispositivo(data);
    await Dispositivos.save();
    res.status(201).json(Dispositivos);
}

//Actulizar Dispositivoes 
const actualizarDispositivo = async (req, res = response) => {
    
    const { id } = req.params;
    const {...data } = req.body;

    //const Dispositivoes = await Dispositivo.findByIdAndUpdate(id, {serieIot:data.serieIot,estadoInstalacion:data.estadoInstalacion,fechaActivacion:data.estadoInstalacion},{ new: true });
    const Dispositivoes = await Dispositivo.findByIdAndUpdate(id, data,{ new: true });
    res.json(Dispositivoes);
}

//Borrar Dispositivoes -estado: false
const borrarDispositivo = async (req, res = response) => {
    const { id } = req.params;
    const DispositivoesBorrada = await Dispositivo.findByIdAndRemove(id);
    res.json(DispositivoesBorrada);

}

module.exports = {
    obtenerDispositivos,
    obtenerDispositivo,
    crearDispositivo,
    actualizarDispositivo,
    borrarDispositivo
}