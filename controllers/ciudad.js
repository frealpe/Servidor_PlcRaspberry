const { response } = require("express");
const {Ciudad} = require('../models');

//Obtener Ciudades-Proyecto
const obtenerCiudades = async (req, res = response) => {
    //const {nombre} = req.params;
    console.log(req.body);
    console.log(req.params);
    console.log("Entre");
    
    const query = { estado: true }; 
    const [totales, nombre] = await Promise.all([
        Ciudad.countDocuments(query),
        Ciudad.find(query)
    ])
 
    res.json({
        totales,
        nombre,
    }); 
}

//Obtener Ciudades - por id populate ()
const obtenerCiudad = async (req, res = response) => {
    
    const {id} = req.params;
    console.log(id);
    const Ciudades = await Ciudad.findById(id);
    res.json({
        Ciudades
    }); 
}

//Crear una Ciudad 
const crearCiudad = async (req, res = response) => {
    
    const nombre = req.body.nombre;
    console.log(Ciudad);

    const CiudadesDB = await Ciudad.findOne({nombre});
    if (CiudadesDB) {
        return res.status(400).json({
            msg: `El Ciudad ${CiudadesDB.Ciudad},ya existe` 
        });
    }  
    const data = {
        nombre: req.body.nombre,
    }
    const Ciudades = new Ciudad(data);
    await Ciudades.save();
    res.status(201).json(Ciudades);
}

//Actulizar Ciudades 
const actualizarCiudad = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre;
    }
    const Ciudades = await Ciudad.findByIdAndUpdate(id, data,{ new: true });
    res.json(Ciudades);
}

//Borrar Ciudades -estado: false
const borrarCiudad = async (req, res = response) => {
    const { id } = req.params;
    const CiudadesBorrada = await Ciudad.findByIdAndRemove(id);
    res.json(CiudadesBorrada);

}

module.exports = {
    obtenerCiudades,
    obtenerCiudad,
    crearCiudad,
    actualizarCiudad,
    borrarCiudad
}