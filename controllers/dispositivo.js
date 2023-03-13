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

/*
   Dispostivo
   id
   medidor
*/

/*
  Medidor
  TipoMedidor
  ..
*/

/*
  MedicionDispositivo
  iddispositivo
  fechahora
  nivel
  rssi
  varc1
  varc2
  varc3
 */

//Crear una Dispositivoes 
const crearDispositivo = async (req, res = response) => {    
    const idProyecto = req.body.proyecto;    
    const DispositivoesDB = await Dispositivo.findOne({idProyecto});
    if (DispositivoesDB) {
        return res.status(400).json({
            msg: `El Dispositivo ${DispositivoesDB.idDispositivo},ya existe`
        });
    }  
    const data = {
        proyecto:req.body.proyecto,
        idDispositivo,
        tipoDispositivo:req.body.tipoDispositivo
    }
    const Dispositivoes = new Dispositivo(data);
    await Dispositivoes.save();
    res.status(201).json(Dispositivoes);
}

//Actulizar Dispositivoes 
const actualizarDispositivo = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.idDispositivo) {
        data.idDispositivo= data.idDispositivo.toUpperCase();
        data.tipoDispositivo= data.tipoDispositivo;
        data.proyecto = data.proyecto;

    }

    const Dispositivoes = await Dispositivo.findByIdAndUpdate(id, data,{ new: true });
    res.json(Dispositivoes);
}

//Borrar Dispositivoes -estado: false
const borrarDispositivo = async (req, res = response) => {
    console.log('borrar');
    const { id } = req.params;
    //const DispositivoesBorrada = await Dispositivoes.findByIdAndUpdate(id, {estado:false },{ new: true });
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