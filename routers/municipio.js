const Router = require('express');
const { check } = require('express-validator');
const { crearMunicipio,
        obtenerMunicipio,
        actualizarMunicipio,
        borrarMunicipio,
        obtenerMunicipios} = require('../controllers/municipio');
const { existeMunicipioPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Municipio publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerMunicipios);

//Obtener una Municipio por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeMunicipioPorId),
    validarCampos
], obtenerMunicipio);

//Crear un Municipio privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearMunicipio);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeMunicipioPorId),
    validarCampos
], actualizarMunicipio);
 
//Borrar Municipio solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarMunicipio);

module.exports = router;