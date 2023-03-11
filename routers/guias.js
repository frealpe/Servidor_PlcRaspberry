const Router = require('express');
const { check } = require('express-validator');
const { crearGuia,
        obtenerGuias,
        obtenerGuia,
        actualizarGuia,
        borrarGuia} = require('../controllers/Guias');
const { existeGuiaPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Guia publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerGuias);

//Obtener una Guia por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeGuiaPorId),
    validarCampos
], obtenerGuia);

//Crear un Guia privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearGuia);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeGuiaPorId),
    validarCampos
], actualizarGuia);
 
//Borrar Guia solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarGuia);

module.exports = router;