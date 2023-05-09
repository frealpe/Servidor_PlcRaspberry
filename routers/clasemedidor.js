const Router = require('express');
const { check } = require('express-validator');
const { obtenerCMedidor,
        actualizarCMedidor,
        borrarCMedidor,        
        obtenerCMedidores,
        crearCMedidor} = require('../controllers/clasemedidor');
const { existeCMedidorPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las TMedidor publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerCMedidores);

//Obtener una TMedidor por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCMedidorPorId),
    validarCampos
], obtenerCMedidor);

//Crear un TMedidor privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('marca', 'La Marca es Obligatoria').not().isEmpty(),
    validarCampos
], crearCMedidor);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('denominacion', 'La Denominacion es Obligatorio').not().isEmpty(),
    check('id').custom(existeCMedidorPorId),
    validarCampos
], actualizarCMedidor);
 
//Borrar TMedidor solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarCMedidor);
 
module.exports = router;