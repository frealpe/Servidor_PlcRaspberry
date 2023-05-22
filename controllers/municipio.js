const { response } = require("express");
const {Municipio} = require('../models');

//Obtener Municipioes-Proyecto
const obtenerMunicipios = async (req, res = response) => {
    
    const query = { estado: true }; 
    const [totales, nombre] = await Promise.all([
        Municipio.countDocuments(query),
        Municipio.find(query)
    ])
 
    res.json({
        totales,
        nombre,
    }); 
}

//Obtener Municipioes - por id populate ()
const obtenerMunicipio = async (req, res = response) => {
    
    const {id} = req.params;

    const Municipioid = await Municipio.findById(id);
    res.json({
        Municipioid
    }); 
}

//Crear una Municipio 
const crearMunicipio = async (req, res = response) => {
    
    const nombre = req.body.nombre;
    console.log(Municipio);

    const MunicipioDB = await Municipio.findOne({nombre});
    if (MunicipioDB) {
        return res.status(400).json({
            msg: `El Municipio ${MunicipioDB.Municipio},ya existe` 
        });
    }  
    const data = {
        nombre: req.body.nombre,
    }
    const Municipio = new Municipio(data);
    await Municipio.save();
    res.status(201).json(Municipio);
}

//Actulizar Municipioes 
const actualizarMunicipio = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre;
    }
    const Municipioes = await Municipio.findByIdAndUpdate(id, data,{ new: true });
    res.json(Municipioes);
}

//Borrar Municipioes -estado: false
const borrarMunicipio = async (req, res = response) => {
    const { id } = req.params;
    const MunicipioesBorrada = await Municipio.findByIdAndRemove(id);
    res.json(MunicipioesBorrada);

}

module.exports = {
    obtenerMunicipios,
    obtenerMunicipio,
    crearMunicipio,
    actualizarMunicipio,
    borrarMunicipio
}