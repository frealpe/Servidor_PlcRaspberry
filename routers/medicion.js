const Router = require('express');
const { check } = require('express-validator');
const { crearMedicion,
        obtenerMedicion} = require('../controllers/medicion');
//const { existeMedicionPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Medicion publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerMedicion);

//Crear un Medicion privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    validarJWT,
    check('dipositivo', 'El dipositivo es Obligatorio').not().isEmpty(),
    validarCampos
], crearMedicion);

 
module.exports = router;