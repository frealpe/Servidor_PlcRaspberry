const { response } = require("express");
const { Salas } = require('../models')

//Obtener Salas -paginado -total- populate
const obtenerSalas = async (req, res = response) => {

    //TODO recibir numeros no letras
    const { limite = 50, desde = 0 } = req.query;
    const query = { estado: true };

    const [totales, salas,descripcion] = await Promise.all([
        Salas.countDocuments(query),
        Salas.find(query)
            .populate('nombre','laboratorista')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        totales,
        descripcion,
        salas,
    });
}

//Obtener Salas - por id populate ()
const obtenerSala = async (req, res = response) => {

    const { id } = req.params;
    const salas = await Salas.findById(id);

    res.json({
        salas
    });
}

//Crear una Salas 
const crearSalas = async (req, res = response) => {
   
    const nombre = req.body.nombre.toUpperCase();

    const SalasDB = await Salas.findOne({ nombre });

    if (SalasDB) {
        return res.status(400).json({
            msg: `La Sala ${SalasDB.nombre},ya existe`
        });
    }

    const data = {
        nombre,
        laboratorista: req.body.laboratorista.toUpperCase(),
        descripcion: req.body.descripcion,
        img:req.body.img,  
    }
    const salas = new Salas(data);
    await salas.save();

    res.status(201).json(salas);

}

//Actualizar Salas 
const actualizarSalas = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
        data.laboratorista = data.laboratorista.toUpperCase();
        data.descripcion = data.descripcion.toUpperCase();
        //TODO BORRAR

    }
    const salas = await Salas.findByIdAndUpdate(id, data,{ new: true });
    res.json(salas);
}

//Borrar Salas -estado: false
const borrarSalas = async (req, res = response) => {

    const { id } = req.params;
    //const SalasBorrada = await Salas.findByIdAndUpdate(id, {estado:false },{ new: true });
    const SalasBorrada = await Salas.findByIdAndRemove(id);
    res.json(SalasBorrada);

}

module.exports = {
    crearSalas,
    obtenerSalas,
    obtenerSala,
    actualizarSalas,
    borrarSalas
}