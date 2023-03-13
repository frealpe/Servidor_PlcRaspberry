const { response } = require("express");
const {TipoMedidor} = require('../models');

//Obtener TMedidores-Proyecto
const obtenerTMedidores = async (req, res = response) => {
    
    const query = { estado: true };
    
    const [totales, TMedidores] = await Promise.all([
        TipoMedidor.countDocuments(query),
        TipoMedidor.find(query)
    ])
 
    res.json({
        totales,
        TMedidores,
    }); 
}

//Obtener TMedidores - por id populate ()
const obtenerTMedidor = async (req, res = response) => {
    const {id} = req.params;
    const TMedidores = await TipoMedidor.findById(id);
    res.json({
        TMedidores
    });    
}

//Crear una TMedidores 
const crearTMedidor = async (req, res = response) => {
    
    const denominacion = req.body.denominacion;   
    const TMedidoresDB = await TipoMedidor.findOne({denominacion});
    if (TMedidoresDB) {
        return res.status(400).json({
            msg: `El Tipo de Medidor ${TMedidoresDB.idTMedidor},ya existe`
        });
    }  
    const data = {
        denominacion,

    }
    const TMedidores = new TipoMedidor(data);
    await TMedidores.save();
    res.status(201).json(TMedidores);
}

//Actulizar TMedidores 
const actualizarTMedidor = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.denominacion) {
        data.denominacion = data.denominacion;

    }
    const TMedidores = await TipoMedidor.findByIdAndUpdate(id, data,{ new: true });
    res.json(TMedidores);
}

//Borrar TMedidores -estado: false
const borrarTMedidor = async (req, res = response) => {
    const { id } = req.params;
    const TMedidoresBorrada = await TipoMedidor.findOneAndRemove(id);
    res.json(TMedidoresBorrada);
}

module.exports = {
    obtenerTMedidores,
    obtenerTMedidor,
    crearTMedidor,
    actualizarTMedidor,
    borrarTMedidor
}