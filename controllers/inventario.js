const { response } = require("express");
const { Inventario } = require('../models');


//Obtener Inventarios -paginado -total- populate
const obtenerInventarios = async (req, res = response) => {
    //TODO recibir numeros no letras
    const refe = req.body.componente;
    const [componente] = await Promise.all([
        Inventario.find(refe)
            .populate('cantidad','sala')
    ])

    res.json({
        componente,
    });
}

//Obtener Inventarios - por id populate ()
const obtenerInventario = async (req, res = response) => {

    const { id } = req.params;
    const Inventarios = await Inventarios.findById(id);

    res.json({
        Inventarios
    });
}

//Crear una Inventarios 
const crearInventario = async (req, res = response) => {
   
    const refe = req.body.refe;
    const InventariosDB = await Inventario.findOne({refe});
  
    if (InventariosDB) {
        return res.status(400).json({
            msg: `El Inventario ${InventariosDB.refe},ya existe`
        });
    }
    const data = { 
        refe:req.body.refe,
        cantidad:req.body.cantidad,
        componente:req.body.componente,
        sala: req.body.sala,
        estado:req.body.estado,
    }
     
    const inventarios = new Inventario(data);
    await inventarios.save();
    res.status(201).json(inventarios); 
}

//Actulizar Inventarios 
const actualizarInventarios = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.refe) {
        data.nombre = data.refe.toUpperCase();
        data.sala = data.sala;
        data.componente= data.componente;
        data.estado=data.estado;
        data.cantidad=data.cantidad;        
    }

    const Inventarios = await Inventario.findByIdAndUpdate(id, data,{ new: true });
    res.json(Inventarios);
}

//Borrar Inventarios -estado: false
const borrarInventarios = async (req, res = response) => {
    const { id } = req.params;
    //const InventariosBorrada = await Inventarios.findByIdAndUpdate(id, {estado:false },{ new: true });
    const InventariosBorrada = await Inventarios.findOneAndRemove(id);
    res.json(InventariosBorrada);

}

module.exports = {
    crearInventario,
    obtenerInventarios,
    obtenerInventario,
    actualizarInventarios,
    borrarInventarios
}