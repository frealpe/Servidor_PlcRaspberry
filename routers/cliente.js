const Router = require('express');
const { check } = require('express-validator');
const { crearCliente,
        obtenerCliente,
        actualizarCliente,
        borrarCliente,
        obtenerClientes} = require('../controllers/cliente');
const { existeClientePorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Cliente publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerClientes);

//Obtener una Cliente por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeClientePorId),
    validarCampos
], obtenerCliente);

//Crear un Cliente privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('identificacion', 'El identificador es Obligatorio').not().isEmpty(),
    validarCampos
], crearCliente);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('identificacion', 'La identificacion es Obligatorio').not().isEmpty(),
    check('id').custom(existeClientePorId),
    validarCampos
], actualizarCliente);
 
//Borrar Cliente solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarCliente);
 
module.exports = router;