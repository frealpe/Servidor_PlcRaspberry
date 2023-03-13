const { response } = require("express");
const {Proyecto} = require('../models');

//Obtener Proyectoes-Proyecto
const obtenerProyectos = async (req, res = response) => {
   
    const query = { estado: true };
    const [totales, Proyectos] = await Promise.all([
        Proyecto.countDocuments(query),
        Proyecto.find(query)
        .populate('ciudad','nombre')
        .populate('operador','nombre')
    ]) 
    res.json({
        totales,
        Proyectos,
    }); 
}

//Obtener Proyectoes - por id populate ()
const obtenerProyecto = async (req, res = response) => { 
    
    const {id} = req.params;
    const Proyectos = await Proyecto.findById(id);
    res.json({
        Proyectos
    }); 
}

//Crear una Proyecto 
const crearProyecto = async (req, res = response) => {
    
    const nombre = req.body.nombre;

    const ProyectoDB = await Proyecto.findOne({nombre});
    if (ProyectoDB) {
        return res.status(400).json({
            msg: `El Proyecto ${ProyectoDB.idProyecto},ya existe`
        });
    }  
    const data = {
        nombre: req.body.nombre,
        ciudad: req.body.ciudad,
        operador: req.body.operador

    }
    const Proyectos = new Proyecto(data);
    await Proyectos.save();
    res.status(201).json(Proyectos);
}

//Actulizar Proyectoes 
const actualizarProyecto = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre;
        data.ciudad = data.ciudad;
        data.operador= data.operador;
    }
    const Proyectos = await Proyecto.findByIdAndUpdate(id, data,{ new: true });
    res.json(Proyectos);
}

//Borrar Proyectoes -estado: false
const borrarProyecto = async (req, res = response) => {
    console.log('borrar');
    const { id } = req.params;
    const ProyectoesBorrada = await Proyecto.findByIdAndRemove(id);
    res.json(ProyectoesBorrada);

}

module.exports = {
    obtenerProyectos,
    obtenerProyecto,
    crearProyecto,
    actualizarProyecto,
    borrarProyecto
}