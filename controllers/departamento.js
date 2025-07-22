const { response } = require("express");
const {Departamento} = require('../models');

//Obtener Departamentoes-Proyecto
const obtenerDepartamentos = async (req, res = response) => {
   
    const query = { estado: true }; 
    const [totales, nombre] = await Promise.all([
        Departamento.countDocuments(query),
        Departamento.find(query)
    ])
 
    res.json({
        totales,
        nombre,
    }); 
}

//Obtener Departamentoes - por id populate ()
const obtenerDepartamento = async (req, res = response) => {
    
    const {id} = req.params;
    console.log(id);
    const Departamentoes = await Departamento.findById(id);
    res.json({
        Departamentoes
    }); 
}

//Crear una Departamento 
const crearDepartamento = async (req, res = response) => {
    
    const nombre = req.body.nombre;
    console.log(Departamento);

    const DepartamentoesDB = await Departamento.findOne({nombre});
    if (DepartamentoesDB) {
        return res.status(400).json({
            msg: `El Departamento ${DepartamentoesDB.Departamento},ya existe`  
        });
    }  
    const data = {
        nombre: req.body.nombre,
    }
    const Departamentoes = new Departamento(data);
    await Departamentoes.save();
    res.status(201).json(Departamentoes);
}

//Actulizar Departamentoes 
const actualizarDepartamento = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre;
    }
    const Departamentoes = await Departamento.findByIdAndUpdate(id, data,{ new: true });
    res.json(Departamentoes);
}

//Borrar Departamentoes -estado: false
const borrarDepartamento = async (req, res = response) => {
    const { id } = req.params;
    const DepartamentoesBorrada = await Departamento.findByIdAndRemove(id);
    res.json(DepartamentoesBorrada);

}

module.exports = {
    obtenerDepartamentos,
    obtenerDepartamento,
    crearDepartamento,
    actualizarDepartamento,
    borrarDepartamento
}