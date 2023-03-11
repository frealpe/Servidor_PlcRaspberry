const { response } = require("express");
const {Operador} = require('../models');

//Obtener Operadores-Proyecto
const obtenerOperadores = async (req, res = response) => {
    const {proyecto} = req.params;
    
    const query = { proyecto: proyecto };
    const [totales, Operadores] = await Promise.all([
        Operador.countDocuments(query),
        Operador.find(query)
    ])
 
    res.json({
        totales,
        Operadores,
    }); 
}

//Obtener Operadores - por id populate ()
const obtenerOperador = async (req, res = response) => {
    
    const {id} = req.params;
    console.log("Entre");
    console.log(id);
    const Operadores = await Operador.findById(id);
    res.json({
        Operadores
    }); 
}

//Crear una Operador 
const crearOperador = async (req, res = response) => {
    
    const nitOperador = req.body.nit;

    const OperadoresDB = await Operador.findOne({nitOperador});
    if (OperadoresDB) {
        return res.status(400).json({
            msg: `El Operador ${OperadoresDB.idOperador},ya existe`
        });
    }  
    const data = {
        nombre: req.body.nombre,
        nitOperador,
    }
    const Operadores = new Operador(data);
    await Operadores.save();
    res.status(201).json(Operadores);
}

//Actulizar Operadores 
const actualizarOperador = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre;
    }
    const Operadores = await Operador.findByIdAndUpdate(id, data,{ new: true });
    res.json(Operadores);
}

//Borrar Operadores -estado: false
const borrarOperador = async (req, res = response) => {
    console.log('borrar');
    const { id } = req.params;
    const OperadoresBorrada = await Operador.findOneAndRemove(id);
    res.json(OperadoresBorrada);

}

module.exports = {
    obtenerOperadores,
    obtenerOperador,
    crearOperador,
    actualizarOperador,
    borrarOperador
}