const { response } = require("express");
const { AdminProyecto } = require("../models");

//Obtener Proyectoes-Proyecto
const obteneradminProyectos = async (req, res = response) => {
  const query = { estado: true };
  const [asociado] = await Promise.all([AdminProyecto.find({})]);
  res.json({
    asociado,
  });
};

//Obtener Proyectoes - por id populate ()
const obteneradminProyectoid = async (req, res = response) => {
  const { id } = req.params;
  const asociado = await AdminProyecto.findById(id);
  res.json({
    asociado,
  });
};

//Crear una Proyecto
const crearadminProyecto = async (req, res = response) => {
  const { usuario, proyecto } = req.body;
  const asociado = new AdminProyecto({ usuario, proyecto });
  //Guardar en BD
  await asociado.save();

  res.status(201).json({
    asociado,
  });
};

const actualizaradminProyecto = async (req, res = response) => {

  const { id } = req.params;
  const {...data } = req.body;


  const AdminProyect = await AdminProyecto.findByIdAndUpdate(id, data,{ new: true });
  res.json(AdminProyect);
}

const borrarAdminproyecto = async (req, res = response) => {
  const { id } = req.params;
  const adminBorrado = await AdminProyecto.findByIdAndRemove(id);
  res.json(adminBorrado);
}
module.exports = {
  obteneradminProyectos,
  obteneradminProyectoid,
  crearadminProyecto,
  borrarAdminproyecto,
  actualizaradminProyecto 
};
 
