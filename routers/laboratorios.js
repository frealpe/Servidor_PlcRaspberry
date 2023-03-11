const Router = require('express');
const { check } = require('express-validator');
const { crearLaboratorios,
        obtenerLaboratorios,
        obtenerLaboratorio,
        actualizarLaboratorios,
        borrarLaboratorios} = require('../controllers/laboratorios');
const { existeLaboratoriosPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Laboratorios publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerLaboratorios);

//Obtener una Laboratorios por id-publico
router.get('/:id', [
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeLaboratoriosPorId),
    validarCampos
], obtenerLaboratorio);

//Crear un Laboratorios privado - cualqiuer persona con un token valido
router.post('/', [
//    esAdminRole,
    validarJWT,
    //check('id').custom(noexisteSalasPorId),
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearLaboratorios);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeLaboratoriosPorId),
    validarCampos
], actualizarLaboratorios);
 
//Borrar Laboratorios solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarLaboratorios);

module.exports = router;