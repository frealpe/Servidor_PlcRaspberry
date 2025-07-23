const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {
  crearMuestra,
  obtenerMuestras,
  obtenerMuestraPorId,
  actualizarMuestra,
  eliminarMuestra
} = require('../controllers/muestra');

const router = Router();

// Obtener todas las muestras (con paginación)
router.get('/', obtenerMuestras);

// Obtener una muestra por ID
router.get('/:id', obtenerMuestraPorId);

// Crear una nueva muestra
router.post('/', [
  check('proyecto', 'El ID del proyecto es obligatorio').not().isEmpty(),
  check('proyecto', 'El ID del proyecto debe ser válido').isMongoId(),
  check('geoInstalacion', 'La geoInstalacion es obligatoria').not().isEmpty(),
  check('numeromuestra', 'El número de muestra es obligatorio').not().isEmpty(),
  validarCampos,
], crearMuestra);

// Actualizar una muestra
router.put('/:id', [
  check('id', 'El ID no es válido').isMongoId(),
  check('proyecto', 'El ID del proyecto debe ser válido').optional().isMongoId(),
  check('geoInstalacion', 'La geoInstalacion es obligatoria').optional().not().isEmpty(),
  check('numeromuestra', 'El número de muestra es obligatorio').optional().not().isEmpty(),
  validarCampos,
], actualizarMuestra);

// Eliminar una muestra (eliminación lógica)
router.delete('/:id', [
  check('id', 'El ID no es válido').isMongoId(),
  validarCampos,
], eliminarMuestra);

module.exports = router;