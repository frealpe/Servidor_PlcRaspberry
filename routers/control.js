const Router = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos} = require('../middlewares');
const { controlValvula } = require('../controllers/control');

const router = Router();


//Crear un Control privado - cualqiuer persona con un token valido
router.post('/:id', [
    //esAdminRole,
    validarJWT, 
    validarCampos
], controlValvula);

module.exports = router;