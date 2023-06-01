const Router = require('express');
const { check } = require('express-validator');
const { obtenerMMedidor,
        actualizarMMedidor,
        borrarMMedidor,        
        obtenerMMedidores,
        crearMMedidor} = require('../controllers/marcamedidor');
const { existeMMedidorPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las TMedidor publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerMMedidores);

//Obtener una TMedidor por id-publico
router.get('/:id', [
    //validarJWT, 
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeMMedidorPorId),
    validarCampos
], obtenerMMedidor);

//Crear un TMedidor privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('marca', 'La Marca es Obligatoria').not().isEmpty(),
    validarCampos
], crearMMedidor);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
//    esAdminRole,
    check('denominacion', 'La Denominacion es Obligatorio').not().isEmpty(),
    check('id').custom(existeMMedidorPorId),
    validarCampos
], actualizarMMedidor);
 
//Borrar TMedidor solo Admin
router.delete('/:id', [
    validarJWT,
//    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarMMedidor);
 
module.exports = router;