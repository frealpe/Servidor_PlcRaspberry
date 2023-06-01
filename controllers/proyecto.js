const { response } = require("express");
const {Proyecto} = require('../models');

//Obtener Proyectoes-Proyecto
const obtenerProyectos = async (req, res = response) => {
   //console.log("Cargar Proyectos");
    const query = { estado: true };
    const [Proyectos] = await Promise.all([
        Proyecto.find({})        
    ]) 
    res.json({        
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
       
    //console.log("Crear Proyecto");
    const Piloto = req.body.idPiloto;    
    try{
        const ProyectoDB = await Proyecto.findOne({idPiloto:Piloto});
        if (ProyectoDB) {
            return res.status(400).json({ 
            msg: "Grabado",
            });
        }  
        const data = {
            idPiloto: req.body.idPiloto, 
            operador: req.body.operador,
            departamento: req.body.departamento,
            municipio: req.body.municipio,
            estado: req.body.estado,
            numerodispo: req.body.numerodispo,
            fechaCreado: req.body.fechaCreado,  
            
        }
        console.log("Datos a Grabar",data);    
        const Proyectos = new Proyecto(data);
        await Proyectos.save();
        res.status(201).json(Proyectos); 
    }catch (error) {
        json.status(400).json({
          ok: false,
          msg: "Ingreso",
        });
      }
}

//Actulizar Proyectoes 
const actualizarProyecto = async (req, res = response) => {

    const { id } = req.params;
    const {...data } = req.body;
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