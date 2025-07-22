const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  crearPlaga,
  obtenerPlagas,
} = require('../controllers/plagas');

const router = Router();

// Obtener todos los registros de plagas por ID de proyecto
router.get('/:id', obtenerPlagas);

// Crear un nuevo registro de plagas
router.post('/', [
  // check('proyecto', 'El nombre del proyecto es obligatorio').not().isEmpty(),
  // check('fecha', 'La fecha es obligatoria').isISO8601(),
  // check('registro', 'El registro es obligatorio y debe ser un objeto').custom(value => {
  //   if (typeof value !== 'object' || Array.isArray(value)) {
  //     throw new Error('registro debe ser un objeto tipo {1: {...}, 2: {...}, ...}');
  //   }
  //   return true;
  // }),
  validarCampos,
], crearPlaga);

module.exports = router;
