const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagenes,actualizarArchivo, mostrarArchivo} = require('../controllers/uploads');
const { coleccionesPermitidas,existeLaboratoriosPorId } = require('../helpers');
const { validarArchivoSubir,validarJWT } = require('../middlewares');
const { validarCampos} = require('../middlewares/validar-campos');


const router = Router();
 
router.post('/:coleccion',[
    validarArchivoSubir,
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','salas','laboratorios','guias'])),
],cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','salas','laboratorios','guias'])), 
    validarCampos
],actualizarArchivo);
//actualizarImagenCloudinary);
//actualizarImagen);  //Ruta antigua

router.get('/:coleccion/:id',[
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','salas','laboratorios','guias'])),
    validarCampos
],mostrarImagenes);

//Mostrar archivos
router.get('/archivo/:coleccion/:id',[
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','salas','laboratorios','guias'])),
    validarCampos
],mostrarArchivo);

//Actualizar imagen
router.put('/imagen/:coleccion/:id', [
    validarJWT,
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','salas','laboratorios','guias'])), 
    validarCampos
], actualizarImagen);

module.exports = router;