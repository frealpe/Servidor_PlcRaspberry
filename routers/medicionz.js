const Router = require('express');
const { check } = require('express-validator');
const { crearMedicionz,
        obtenerMedicionz} = require('../controllers/medicionz');
//const { existeMedicionPorId} = require('../helpers/db-validators');
const { validarJWT, validarCampos} = require('../middlewares');

const router = Router();

//Obtener todas las Medicion publico
router.get('/', [
    validarJWT, 
    validarCampos
], obtenerMedicionz); 

//Crear un Medicion privado - cualqiuer persona con un token valido
router.post('/', [
    //esAdminRole,
    //validarJWT,
    check('dispositivo', 'El dipositivo es Obligatorio').not().isEmpty(),
    validarCampos
], crearMedicionz);

 
module.exports = router;