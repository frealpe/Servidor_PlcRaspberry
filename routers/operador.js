const Router = require('express');
const { check } = require('express-validator');
const { } = require('../controllers/operador');
const { crearOperador,
        obtenerOperador,
        actualizarOperador,
        borrarOperador,
        obtenerOperadores} = require('../controllers/operador');
const { existeOperadorPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Operador publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerOperadores);

//Obtener una Operador por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeOperadorPorId),
    validarCampos
], obtenerOperador);

//Crear un Operador privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearOperador);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeOperadorPorId),
    validarCampos
], actualizarOperador);
 
//Borrar Operador solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarOperador);

module.exports = router;