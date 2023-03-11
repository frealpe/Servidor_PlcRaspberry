const {Salas, Laboratorios, Guia, Inventario} = require('../models');
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

///////////////////////////////////////////////////////////////////
const existeSalasPorId = async (id) => {
    //Verifcar si existe el correo
    const existeSalas = await Salas.findById(id);
    if (!existeSalas) {
        throw new Error(`La sala ya existe: ${id}`);
    }

}
//////////////////////////////////////////////////////////////////////
const noexisteSalasPorId = async (id) => {

    const existeSalas = await Salas.findById(id);

    if (!existeSalas) {
        throw new Error(`La sala no existe: ${id}`);
    }

}
//////////////////////////////////////////////////////////////////////
const existeLaboratoriosPorId = async (id) => {
    //Verifcar si existe el laboratorio
    const existeLaboratorio = await Laboratorios.findById(id);
    if (!existeLaboratorio) {
        throw new Error(`El Laboratorio: ${id}`);
    }

}
///////////////////////////////////////////////////////////////////
const existeGuiaPorId = async (id) => {
    //Verifcar si existe el laboratorio
    const existeGuia = await Guia.findById(id);
    if (!existeGuia) {
        throw new Error(`La Guia: ${id}`);
    }

}
///////////////////////////////////////////////////////////////////
const valida = async (id='') => {
    //Verifcar si existe el correo
        console.log("Salida");
}

///////////////////////////////////////////////////////////////////
//Validar colecciones   
const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida)
    {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;

}
///////////////////////////////////////////////////////////////////
const existeInventarioPorId = async (id) => {
    console.log(id);
    const existeLaboratorio = await Inventario.findById(id);
    if (!existeLaboratorio) {
        throw new Error(`El inventario: ${id}`);
    }

}
///////////////////////////////////////////////////////////////////
const existeInventarioPorcomponente = async (componente) => {
    //Verifcar si existe el laboratorio
    const existeCompo = await Inventario.findById(componente);
    if (!existeCompo) {
        throw new Error(`El Componente ya existe: ${componente}`);
    }

}
//////////////////////////////////////////////////////////////////

module.exports = {
    esRoleVaido,
    existeSalasPorId,
    existeLaboratoriosPorId,
    existeInventarioPorcomponente,
    noexisteSalasPorId, 
    emailExiste,
    existeUsuarioPorId,
    existeGuiaPorId,
    coleccionesPermitidas,
    existeInventarioPorId,
    valida,
}