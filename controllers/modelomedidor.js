const { response } = require("express");
const {ModeloMedidor} = require('../models');

//Obtener CMedidores-Proyecto
const obtenerMoMedidores = async (req,res = response) => {
    

    console.log("Obtener modelo medidores");
    const query = { estado: true };
    
    const [MoMedidores] = await Promise.all([       
        ModeloMedidor.find({})
    ])
 
    res.json({
        MoMedidores,
    }); 
}

//Obtener CMedidores - por id populate ()
const obtenerMoMedidor = async (req, res = response) => {
    const {id} = req.params;
    const MoMedidores = await ModeloMedidor.findById(id);
    res.json({
        MoMedidores
    });    
}

//Mrear una MoMedidores 
const crearMoMedidor = async (req, res = response) => {
    
    const marca = req.body.marca;   
    const MoMedidoresDB = await ModeloMedidor.findOne({marca});
    if (MoMedidoresDB) {
        return res.status(400).json({
            msg: `El Cipo de Medidor ${MoMedidoresDB.idMoMedidor},ya existe`
        });
    }  
    const data = {
        marca,

    }
    const MoMedidores = new ModeloMedidor(data);
    await MoMedidores.save();
    res.status(201).json(MoMedidores);
}

//Actulizar CMedidores 
const actualizarMoMedidor = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.denominacion) {
        data.denominacion = data.denominacion;

    }
    const MoMedidores = await ModeloMedidor.findByIdAndUpdate(id, data,{ new: true });
    res.json(MoMedidores);
}

//Borrar CMedidores -estado: false
const borrarMoMedidor = async (req, res = response) => {
    const { id } = req.params;
    const MoMedidoresBorrada = await ModeloMedidor.findByIdAndRemove(id);
    res.json(MoMedidoresBorrada);
}

module.exports = {
    obtenerMoMedidores,
    obtenerMoMedidor,
    crearMoMedidor,
    actualizarMoMedidor,
    borrarMoMedidor
}