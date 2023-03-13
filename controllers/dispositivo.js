const { response } = require("express");
const {Dispositivo} = require('../models');

//Obtener Dispositivoes-Proyecto
const obtenerDispositivos = async (req, res = response) => {   
    
    const query = { estado: true };    
    const [totales, Dispositivos] = await Promise.all([
        Dispositivo.countDocuments(query),
        Dispositivo.find(query)
    ])
 
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
    
    const iddispositivo = req.body.iddispositivo;    

    const DispositivoesDB = await Dispositivo.findOne({iddispositivo});
    console.log(DispositivoesDB);
    if (DispositivoesDB) {
        return res.status(400).json({
            msg: `El Dispositivo ${iddispositivo},ya existe`
        });
    }  
    const data = {
        proyecto:req.body.proyecto,
        cliente:req.body.cliente,
        medidor:req.body.medidor,        
        iddispositivo: req.body.iddispositivo,
        matricula:req.body.matricula,        
        direccion:req.body.direccion,
        georeferencia:req.body.georeferencia,         
    }
    const Dispositivod = new Dispositivo(data);
    await Dispositivod.save();
    res.status(201).json(Dispositivod);
}

//Actulizar Dispositivoes 
const actualizarDispositivo = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.iddispositivo) {
        data.proyecto= data.proyecto;
        data.cliente = data.cliente;
        data.medidor= data.medidor;
        data.iddispositivo= data.iddispositivo;
        data.matricula= data.matricula;
        data.direccion= data.direccion;
        data.georeferencia= data.georeferencia;

    }

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