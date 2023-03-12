const Router = require('express');
const { check } = require('express-validator');
const { crearTMedidor,
        obtenerTMedidor,
        actualizarTMedidor,
        borrarTMedidor,
        obtenerTMedidores} = require('../controllers/tipomedidor');
const { existeTMedidorPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las TMedidor publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerTMedidores);

//Obtener una TMedidor por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeTMedidorPorId),
    validarCampos
], obtenerTMedidor);

//Crear un TMedidor privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('denominacion', 'La Denominacion es Obligatorio').not().isEmpty(),
    validarCampos
], crearTMedidor);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('denominacion', 'La Denominacion es Obligatorio').not().isEmpty(),
    check('id').custom(existeTMedidorPorId),
    validarCampos
], actualizarTMedidor);
 
//Borrar TMedidor solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarTMedidor);
 
module.exports = router;