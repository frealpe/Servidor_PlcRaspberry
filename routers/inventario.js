const Router = require('express');
const { check } = require('express-validator');
const { crearInventario,
        obtenerInventario,
        borrarInventarios,
        obtenerInventarios,
        actualizarInventarios} = require('../controllers/Inventario');
const { existeInventarioPorId, existeInventarioPorcomponente} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Inventario publico
router.get('/', [
//    validarJWT, 
    validarCampos
], obtenerInventarios); 

//Obtener una Inventario por id-publico
router.get('/:id', [
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeInventarioPorId),
    validarCampos
], obtenerInventario);

//Crear un Inventario privado - cualqiuer persona con un token valido
router.post('/', [
  //  esAdminRole,
    validarJWT,
    check('refe', 'El nombre es Obligatorio').not().isEmpty(),
    // Se debe hacer la actualizacion /check('componente').custom(existeInventarioPorcomponente),
    validarCampos
], crearInventario);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('refe', 'La referencia es obligatoria').not().isEmpty(),
    check('id').custom(existeInventarioPorId),
    validarCampos
], actualizarInventarios);
 
//Borrar Inventario solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarInventarios);

module.exports = router;