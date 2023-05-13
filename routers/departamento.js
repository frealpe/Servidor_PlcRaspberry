const Router = require('express');
const { check } = require('express-validator');
const { crearDepartamento,
        actualizarDepartamento,
        borrarDepartamento,
        obtenerDepartamentos,
        obtenerDepartamento} = require('../controllers/departamento');

const { existeDepartamentoPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');


const router = Router();

//Obtener todas las Departamento publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerDepartamentos);

//Obtener una Departamento por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeDepartamentoPorId),
    validarCampos
], obtenerDepartamento);

//Crear un Departamento privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearDepartamento);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeDepartamentoPorId),
    validarCampos
], actualizarDepartamento);
 
//Borrar Departamento solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarDepartamento);

module.exports = router;