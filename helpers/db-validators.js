const {Operador, Proyecto, Siembra,
       Cliente, Ciudad} = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');
const LaboresDiaria = require('../models/laboresdiarias');


const esRoleVaido = async (rol = '') => {
    //Verifcar si existe el rol    
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado`)
    }

}

/////////////////////////////////////////////////////////////////
const emailExiste = async (correo = '') => {
    //Verifcar si existe el correo
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya esta registrado`);

    }

}

/////////////////////////////////////////////////////////////////
const existeUsuarioPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeOperadorPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Operador.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeProyectoPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Proyecto.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
const existeClientePorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Cliente.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
const existeMunicipioPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Ciudad.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeDepartamentoPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Departamento.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeSiembraPorId = async (id) => {
    //Verifcar si existe el correo
    const existeSiembra = await Siembra.findById(id);
    if (!existeSiembra) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////

const existeRiegoPorId = async (id) => {
    //Verifcar si existe el correo
    const existeRiego = await Riego.findById(id);
    if (!existeRiego) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeLaborPorId = async (id) => {
    //Verifcar si existe el correo
    const existeLabor = await LaboresDiaria.findById(id);
    if (!existeLabor) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
module.exports = {
    esRoleVaido,
    emailExiste,
    existeUsuarioPorId,
    existeOperadorPorId,
    existeProyectoPorId,
    existeClientePorId,
    existeMunicipioPorId,
    existeDepartamentoPorId,
    existeSiembraPorId,
    existeRiegoPorId,
    existeLaborPorId
}