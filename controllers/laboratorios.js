const { response } = require("express");
const { Laboratorios } = require('../models')

//Obtener Laboratorios -paginado -total- populate
const obtenerLaboratorios = async (req, res = response) => {
    //TODO recibir numeros no letras
    const { limite = 50, desde = 0 } = req.query;
    const query = { estado: true };

    const [totales, laboratorios] = await Promise.all([
        Laboratorios.countDocuments(query),
        Laboratorios.find(query)
            .populate('nombre','sala')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        totales,
        laboratorios,
    });
}

//Obtener Laboratorios - por id populate ()
const obtenerLaboratorio = async (req, res = response) => {
    console.log('Laboratorio por id')
    const { id } = req.params;
    const laboratorios = await Laboratorios.findById(id);

    res.json({
        laboratorios
    });
}

//Crear una Laboratorios 
const crearLaboratorios = async (req, res = response) => {
   
    const nombre = req.body.nombre.toUpperCase();
    const puestos = req.body.puestos;

    const LaboratoriosDB = await Laboratorios.findOne({ nombre });

    if (LaboratoriosDB) {
        return res.status(400).json({
            msg: `El Laboratorio ${LaboratoriosDB.nombre},ya existe`
        });
    }

    const data = {
        nombre,
        sala: req.body.sala.toUpperCase(),
        puestos,
    }
    const laboratorios = new Laboratorios(data);
    await laboratorios.save();
    res.status(201).json(laboratorios);
}

//Actulizar Laboratorios 
const actualizarLaboratorios = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

 /*    console.log("servidor");
    console.log(id);  
    console.log(data); */

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
        data.puestos = data.puestos;
        data.sala = data.sala;
        //console.log(data.nombre,data.puestos,data.sala);
    }

    const laboratorios = await Laboratorios.findByIdAndUpdate(id, data,{ new: true });
    res.json(laboratorios);
}

//Borrar Laboratorios -estado: false
const borrarLaboratorios = async (req, res = response) => {

    const { id } = req.params;
    //const LaboratoriosBorrada = await Laboratorios.findByIdAndUpdate(id, {estado:false },{ new: true });
    const laboratoriosBorrada = await Laboratorios.findByIdAndRemove(id);
    res.json(laboratoriosBorrada);

}

module.exports = {
    crearLaboratorios,
    obtenerLaboratorios,
    obtenerLaboratorio,
    actualizarLaboratorios,
    borrarLaboratorios
}