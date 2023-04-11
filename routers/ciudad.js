const Router = require('express');
const { check } = require('express-validator');
const { crearCiudad,
        obtenerCiudad,
        actualizarCiudad,
        borrarCiudad,
        obtenerCiudades} = require('../controllers/ciudad');
const { existeCiudadPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Ciudad publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerCiudades);

//Obtener una Ciudad por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCiudadPorId),
    validarCampos
], obtenerCiudad);

//Crear un Ciudad privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearCiudad);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCiudadPorId),
    validarCampos
], actualizarCiudad);
 
//Borrar Ciudad solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarCiudad);

module.exports = router;