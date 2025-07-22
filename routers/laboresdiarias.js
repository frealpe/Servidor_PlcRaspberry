const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  crearLabor,
  obtenerLabores,
  actualizarLabor,
  borrarLabor
} = require('../controllers/laboresdiarias');

const {
  existeLaborPorId
} = require('../helpers/db-validators');

const router = Router();

// Obtener todas las labores
router.get('/:id',obtenerLabores);

// Crear una nueva labor
router.post('/', [
  check('fecha', 'La fecha es obligatoria y debe ser válida').isISO8601(),
  check('laborRealizada', 'La labor realizada es obligatoria').not().isEmpty(),
  check('numeroJornales', 'El número de jornales debe ser un número').isNumeric(),
  check('costoJornales', 'El costo de jornales debe ser un número').isNumeric(),
  check('insumosYMateriales', 'insumosYMateriales debe ser un arreglo').optional().isArray(),
  check('insumosYMateriales.*.nombre', 'Cada insumo debe tener un nombre').optional().not().isEmpty(),
  check('insumosYMateriales.*.costo', 'Cada insumo debe tener un costo numérico').optional().isNumeric(),
  check('costoTotal', 'El costo total debe ser un número').isNumeric(),
  validarCampos
], crearLabor);

// Actualizar una labor
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeLaborPorId),
  validarCampos
], actualizarLabor);

// Eliminar una labor
router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeLaborPorId),
  validarCampos
], borrarLabor);

module.exports = router;
