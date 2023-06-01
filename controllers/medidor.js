const { response } = require("express");
const {Medidor} = require('../models');

//Obtener Medidores-Proyecto
const obtenerMedidores = async (req, res = response) => {   
    
    const query = { estado: true };    
    const [totales, Medidores] = await Promise.all([
        Medidor.countDocuments(query),
        Medidor.find(query)
    ])
 
    res.json({
        totales,
        Medidores,
    }); 
}

//Obtener Medidores - por id populate ()
const obtenerMedidor = async (req, res = response) => {
    console.log("medidor");

    const {id} = req.params;
    const Medidores = await Medidor.findById(id);
    res.json({
        Medidores
    }); 
}

//Crear una Medidores 
const crearMedidor = async (req, res = response) => {  
    
    const serie= req.body.serie;    
    const MedidoresDB = await Medidor.findOne({serie});
    if (MedidoresDB) {
        return res.status(400).json({
            msg: `El Medidor ${MedidoresDB.idmedidor},ya existe`
        });
    }  
    const data = {
        marca:req.body.marca,
        modelo:req.body.modelo,
        tipo:req.body.tipo,
        serie:req.body.serie
    }
    const Medidores = new Medidor(data);
    await Medidores.save();
    res.status(201).json(Medidores);
}

//Actulizar Medidores 
const actualizarMedidor = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;

    if (data.idmedidor) {
        data.idmedidor= data.idmedidor.toUpperCase();
        data.tipomedidor= data.tipomedidor;
        data.proyecto = data.proyecto;

    }

    const Medidores = await Medidor.findByIdAndUpdate(id, data,{ new: true });
    res.json(Medidores);
}

//Borrar Medidores -estado: false
const borrarMedidor = async (req, res = response) => {
    console.log('borrar');
    const { id } = req.params;
    //const MedidoresBorrada = await Medidores.findByIdAndUpdate(id, {estado:false },{ new: true });
    const MedidoresBorrada = await Medidor.findByIdAndRemove(id);
    res.json(MedidoresBorrada);

}

module.exports = {
    obtenerMedidores,
    obtenerMedidor,
    crearMedidor,
    actualizarMedidor,
    borrarMedidor
}

// const crearMedidor = async (req, res = response) => {  
    
//     const mmedidor= req.body.marca;    
//     console.log("Creando Medidor");  
//     const MedidoresDB = await Medidor.findOne({mmedidor});
//     if (MedidoresDB) {
//         return res.status(400).json({
//             msg: `El Medidor ${MedidoresDB.idmedidor},ya existe`
//         });
//     }  
//     const data = {
//         marca:req.body.marca,
//         modelo:req.body.modelo,
//         tipo:req.body.tipomedidor
//     }
//     const Medidores = new Medidor(data);
//     await Medidores.save();
//     res.status(201).json(Medidores);
// }