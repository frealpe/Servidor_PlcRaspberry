const Router = require('express');
const { check } = require('express-validator');
const { crearSalas,
        obtenerSalas,
        obtenerSala,
        actualizarSalas,
        borrarSalas} = require('../controllers/salas');
const { existeSalasPorId, coleccionesPermitidas} = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

//Obtener todas las Salas publico
router.get('/', [validarJWT, validarCampos], obtenerSalas);

//Obtener una Salas por id-publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeSalasPorId),
    validarCampos
], obtenerSala);

//Crear una Salas privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearSalas);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
    //esAdminRole,
    check('id','El id debe ser de mongo').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeSalasPorId),
    validarCampos
], actualizarSalas);

//Borrar Salas solo Admin
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarSalas);

module.exports = router;