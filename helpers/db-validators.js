const {Operador, Proyecto, TipoMedidor, Medidor, Dispositivo, Cliente, Ciudad, ClaseMedidor} = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

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
const existeTMedidorPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await TipoMedidor.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}

/////////////////////////////////////////////////////////////////
const existeCMedidorPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await ClaseMedidor.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeMedidorPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Medidor.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeDispositivoPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Dispositivo.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeClientePorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Cliente.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeMedicionPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Cliente.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }
}
/////////////////////////////////////////////////////////////////
const existeCiudadPorId = async (id) => {
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
module.exports = {
    esRoleVaido,
    emailExiste,
    existeUsuarioPorId,
    existeOperadorPorId,
    existeProyectoPorId,
    existeTMedidorPorId,
    existeMedidorPorId,
    existeDispositivoPorId,
    existeClientePorId,
    existeMedicionPorId,
    existeCiudadPorId,
    existeDepartamentoPorId
}