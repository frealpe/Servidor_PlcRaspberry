const Router = require('express');
const { check } = require('express-validator');
const { crearProyecto,
        obtenerProyecto,
        actualizarProyecto,
        borrarProyecto,
        obtenerProyectos} = require('../controllers/proyecto');
const { existeProyectoPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Proyecto publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerProyectos); 

//Obtener una Proyecto por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProyectoPorId),
    validarCampos
], obtenerProyecto);

//Crear un Proyecto privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('idPiloto', 'El nombre es Obligatorio').not().isEmpty(),
    check('operador', 'El operador es Obligatorio').not().isEmpty(),
    validarCampos
], crearProyecto);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProyectoPorId),
    validarCampos
], actualizarProyecto);
 
//Borrar Proyecto solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarProyecto);

module.exports = router;