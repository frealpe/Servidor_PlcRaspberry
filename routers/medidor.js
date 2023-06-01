const Router = require('express');
const { check } = require('express-validator');
const { crearMedidor,
        obtenerMedidor,
        actualizarMedidor,
        borrarMedidor,
        obtenerMedidores} = require('../controllers/medidor');
const { existeMedidorPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Medidor publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerMedidores);

//Obtener una Medidor por id-publico
router.get('/:id', [
    validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeMedidorPorId),
    validarCampos
], obtenerMedidor);

//Crear un Medidor privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('serie','La serie es Obligatoria').not().isEmpty(),
    validarCampos
], crearMedidor);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('idmedidor','El identificador es Obligatorio').not().isEmpty(),
    check('id').custom(existeMedidorPorId),
    validarCampos
], actualizarMedidor);
 
//Borrar Medidor solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarMedidor);

module.exports = router;