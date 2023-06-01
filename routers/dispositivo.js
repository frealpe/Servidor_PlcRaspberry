const Router = require('express');
const { check } = require('express-validator');
const { crearDispositivo,
        obtenerDispositivo,
        actualizarDispositivo,
        borrarDispositivo,
        obtenerDispositivos} = require('../controllers/dispositivo');
const { existeDispositivoPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Dispositivo publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerDispositivos);

//Obtener una Dispositivo por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeDispositivoPorId),
    validarCampos
], obtenerDispositivo);

//Crear un Dispositivo privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('serieMedidor', 'El serial de Medidor es Obligatorio').not().isEmpty(),
    validarCampos
], crearDispositivo);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeDispositivoPorId),
    validarCampos
], actualizarDispositivo);
 
//Borrar Dispositivo solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarDispositivo);
 
module.exports = router;