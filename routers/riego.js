const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  crearRiego,
  obtenerRiegos,
} = require('../controllers/riego');

const {
  existeRiegoPorId
} = require('../helpers/db-validators');

const router = Router();

// Obtener todos los registros de riego por proyecto
router.get('/:id', obtenerRiegos);

// Crear un nuevo registro de riego
router.post('/', [
  // check('fecha', 'La fecha es obligatoria y debe tener formato ISO').isISO8601(),
  // check('lote', 'El lote debe ser un número').isNumeric(),
  // check('sistema', 'El sistema es obligatorio').not().isEmpty(),
  // check('numeroPlantas', 'El número de plantas debe ser numérico').isNumeric(),
  // check('requerimientoArbol', 'El requerimiento por árbol debe ser numérico').isNumeric(),
  // check('tiempoRiego', 'El tiempo de riego debe ser numérico').isNumeric(),
  // check('descargaDifusor', 'La descarga del difusor debe ser numérica').isNumeric(),
  // check('aguaTotalLitros', 'El total de agua debe ser numérico').isNumeric(),
  // check('observaciones', 'Las observaciones son opcionales').optional().isString(),
  // check('proyecto', 'El ID del proyecto es obligatorio').isMongoId(),
  validarCampos
], crearRiego);

// Actualizar un registro de riego


module.exports = router;
