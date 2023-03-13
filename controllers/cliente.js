const { response } = require("express");
const { Cliente } = require('../models');

//Obtener Cliente-Proyecto
const obtenerClientes = async (req, res = response) => {   

    const query = { estado: true };    
    const [totales, Clientes] = await Promise.all([
        Cliente.countDocuments(query),
        Cliente.find(query)
    ])
 
    res.json({
        totales,
        Clientes,
    }); 
}

//Obtener Cliente - por id populate ()
const obtenerCliente = async (req, res = response) => {

    const {id} = req.params;

    console.log(id);
    const Clientedb = await Cliente.findById(id); 
    res.json({
        Cliente:Clientedb    
    }); 
}

//Crear una Cliente 
const crearCliente = async (req, res = response) => {    
    
    const identificacion = req.body.identificacion;  
    const ClienteDB = await Cliente.findOne({identificacion});
    if (ClienteDB) {
        return res.status(400).json({
            msg: `El Cliente ${ClienteDB.identificacion},ya existe`
        });
    }  
    const data = {
        identificacion: req.body.identificacion,  
        nombre:req.body.nombre
    }
    const Clientedb = new Cliente(data);
    await Clientedb.save();
    res.status(201).json(Clientedb);  
}

//Actulizar Cliente 
const actualizarCliente = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.identificacion) {
        data.identificacion= data.identificacion;
        data.nombre= data.nombre;
    }

    const Clientedb = await Cliente.findByIdAndUpdate(id, data,{ new: true });
    res.json({Cliente:Clientedb});
}

//Borrar Cliente -estado: false
const borrarCliente = async (req, res = response) => {
    console.log('borrar');
    const { id } = req.params;
    //const ClienteBorrada = await Cliente.findByIdAndUpdate(id, {estado:false },{ new: true });
    const ClienteBorrada = await Cliente.findOneAndRemove(id);
    res.json(ClienteBorrada);

}

module.exports = {
    obtenerCliente,
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    borrarCliente
}