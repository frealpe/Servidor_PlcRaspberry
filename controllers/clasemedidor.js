const { response } = require("express");
const {ClaseMedidor} = require('../models');

//Obtener CMedidores-Proyecto
const obtenerCMedidores = async (req, res = response) => {
    
    const query = { estado: true };
    
    const [totales, CMedidores] = await Promise.all([
        ClaseMedidor.countDocuments(query),
        ClaseMedidor.find(query)
    ])
 
    res.json({
        totales,
        CMedidores,
    }); 
}

//Obtener CMedidores - por id populate ()
const obtenerCMedidor = async (req, res = response) => {
    const {id} = req.params;
    const CMedidores = await ClaseMedidor.findById(id);
    res.json({
        CMedidores
    });    
}

//Crear una CMedidores 
const crearCMedidor = async (req, res = response) => {
    
    const marca = req.body.marca;   
    const CMedidoresDB = await ClaseMedidor.findOne({marca});
    if (CMedidoresDB) {
        return res.status(400).json({
            msg: `El Cipo de Medidor ${CMedidoresDB.idCMedidor},ya existe`
        });
    }  
    const data = {
        marca,

    }
    const CMedidores = new ClaseMedidor(data);
    await CMedidores.save();
    res.status(201).json(CMedidores);
}

//Actulizar CMedidores 
const actualizarCMedidor = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.denominacion) {
        data.denominacion = data.denominacion;

    }
    const CMedidores = await ClaseMedidor.findByIdAndUpdate(id, data,{ new: true });
    res.json(CMedidores);
}

//Borrar CMedidores -estado: false
const borrarCMedidor = async (req, res = response) => {
    const { id } = req.params;
    const CMedidoresBorrada = await ClaseMedidor.findByIdAndRemove(id);
    res.json(CMedidoresBorrada);
}

module.exports = {
    obtenerCMedidores,
    obtenerCMedidor,
    crearCMedidor,
    actualizarCMedidor,
    borrarCMedidor
}