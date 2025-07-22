const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  crearSiembra,
  obtenerSiembras,
  actualizarSiembra,
  borrarSiembra
} = require('../controllers/siembra');

const {
  existeSiembraPorId
} = require('../helpers/db-validators');

const router = Router();

// Obtener todas las siembras (por proyecto, finca, o como lo definas)
router.get('/:id', obtenerSiembras); 

// Crear una nueva siembra
router.post('/', [
  check('fechaSiembra', 'La fecha de siembra es obligatoria y debe ser válida').isISO8601(),
  check('lote', 'El lote debe ser un número').isNumeric(),
  check('variedad', 'La variedad es obligatoria').not().isEmpty(),
  check('patron', 'El patrón es obligatorio').not().isEmpty(),
  check('proveedorMaterial', 'El proveedor del material de siembra es obligatorio').not().isEmpty(),
  check('numeroPlantulasSembradas', 'El número de plántulas sembradas debe ser numérico').isNumeric(),
  check('numeroSiembraNueva', 'El número de siembra nueva debe ser numérico').optional().isNumeric(),
  check('numeroResiembra', 'El número de resiembra debe ser numérico').optional().isNumeric(),
  check('distanciaSiembra.calle', 'La distancia entre calles debe ser numérica').isNumeric(),
  check('distanciaSiembra.plantas', 'La distancia entre plantas debe ser numérica').isNumeric(),
  check('operarioEncargado', 'El nombre del operario es obligatorio').not().isEmpty(),
  validarCampos
], crearSiembra);

// Actualizar una siembra
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeSiembraPorId),
  validarCampos
], actualizarSiembra);

// Eliminar una siembra
router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeSiembraPorId),
  validarCampos
], borrarSiembra);

module.exports = router;
