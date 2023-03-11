const { response } = require("express");
const {Guia} = require('../models');

//Obtener Guias -paginado -total- populate
const obtenerGuias = async (req, res = response) => {
    //TODO recibir numeros no letras
    const { limite = 50, desde = 0 } = req.query;
    const query = { estado: true };

    const [totales, Guias] = await Promise.all([
        Guia.countDocuments(query),
        Guia.find(query)
            .populate('nombre','laboratorios')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
 
    res.json({
        totales,
        Guias,
    }); 
}

//Obtener Guias - por id populate ()
const obtenerGuia = async (req, res = response) => {
    const {id} = req.params;
    const Guias = await Guia.findById(id);
    res.json({
        Guias
    }); 
}

//Crear una Guias 
const crearGuia = async (req, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();   
    const GuiasDB = await Guia.findOne({nombre});
    if (GuiasDB) {
        return res.status(400).json({
            msg: `La Guia ${GuiasDB.nombre},ya existe`
        });
    }  
    const data = {
        nombre,
        laboratorio: req.body.laboratorio.toUpperCase(),
        ref:req.body.ref,
        arch:req.body.arch,
    }
    const Guias = new Guia(data);
    await Guias.save();
    res.status(201).json(Guias);
}

//Actulizar Guias 
const actualizarGuia = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
        data.ref= data.ref;
        data.laboratorio = data.laboratorio;

    }

    const Guias = await Guia.findByIdAndUpdate(id, data,{ new: true });
    res.json(Guias);
}

//Borrar Guias -estado: false
const borrarGuia = async (req, res = response) => {
    console.log('borrar');
    const { id } = req.params;
    //const GuiasBorrada = await Guias.findByIdAndUpdate(id, {estado:false },{ new: true });
    const GuiasBorrada = await Guia.findOneAndRemove(id);
    res.json(GuiasBorrada);

}

module.exports = {
    crearGuia,
    obtenerGuias,
    obtenerGuia,
    actualizarGuia,
    borrarGuia
}