const { response } = require("express");
const {MarcaMedidor} = require('../models');

//Obtener CMedidores-Proyecto
const obtenerMMedidores = async (req,res = response) => {
    

    console.log("Obtener medidores");
    const query = { estado: true };
    
    const [MMedidores] = await Promise.all([       
        MarcaMedidor.find({})
    ])
 
    res.json({
        MMedidores,
    }); 
}

//Obtener CMedidores - por id populate ()
const obtenerMMedidor = async (req, res = response) => {
    const {id} = req.params;
    const MMedidores = await MarcaMedidor.findById(id);
    res.json({
        MMedidores
    });    
}

//Mrear una MMedidores 
const crearMMedidor = async (req, res = response) => {
    
    const marca = req.body.marca;   
    const MMedidoresDB = await MarcaMedidor.findOne({marca});
    if (MMedidoresDB) {
        return res.status(400).json({
            msg: `El Tipo de Medidor ${MMedidoresDB.idMMedidor},ya existe`
        });
    }  
    const data = {
        marca,

    }
    const MMedidores = new MarcaMedidor(data);
    await MMedidores.save();
    res.status(201).json(MMedidores);
}

//Actulizar CMedidores 
const actualizarMMedidor = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.denominacion) {
        data.denominacion = data.denominacion;

    }
    const MMedidores = await MarcaMedidor.findByIdAndUpdate(id, data,{ new: true });
    res.json(MMedidores);
}

//Borrar CMedidores -estado: false
const borrarMMedidor = async (req, res = response) => {
    const { id } = req.params;
    const MMedidoresBorrada = await MarcaMedidor.findByIdAndRemove(id);
    res.json(MMedidoresBorrada);
}

module.exports = {
    obtenerMMedidores,
    obtenerMMedidor,
    crearMMedidor,
    actualizarMMedidor,
    borrarMMedidor
}