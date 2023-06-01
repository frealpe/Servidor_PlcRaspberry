const Router = require('express');
const { check } = require('express-validator');
const { obtenerMoMedidor,
        actualizarMoMedidor,
        borrarMoMedidor,        
        obtenerMoMedidores,
        crearMoMedidor} = require('../controllers/modelomedidor');
const { existeMoMedidorPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las TMedidor publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerMoMedidores);

//Obtener una TMedidor por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeMoMedidorPorId),
    validarCampos
], obtenerMoMedidor);

//Crear un TMedidor privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('marca', 'La Marca es Obligatoria').not().isEmpty(),
    validarCampos
], crearMoMedidor);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('denominacion', 'La Denominacion es Obligatorio').not().isEmpty(),
    check('id').custom(existeMoMedidorPorId),
    validarCampos
], actualizarMoMedidor);
 
//Borrar TMedidor solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarMoMedidor);
 
module.exports = router;