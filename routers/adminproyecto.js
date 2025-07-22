const Router = require("express");
const { check } = require("express-validator");
const { 
  obteneradminProyectos,
  crearadminProyecto,
  obteneradminProyectoid,
  actualizaradminProyecto,
  borrarAdminproyecto,
} = require("../controllers/adminproyecto");
const {
  existeAdminProyectoPorId,
} = require("../helpers/db-validators");
const { validarCampos, validarJWT} = require("../middlewares");
const router = Router();

//////////////////////////////////////////////////
router.get("/", [validarJWT, validarCampos], obteneradminProyectos);
//////////////////////////////////////////////////
router.post(
  "/",
  [
    //Se envia en [] la validación del correo
    // validarJWT,
    check("usuario", "El usuario es Obligatorio").not().isEmpty(),
    check("proyecto", "El proyecto es Obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearadminProyecto
);
//////////////////////////////////////////////////
router.get("/:id", [validarJWT, validarCampos], obteneradminProyectoid);
//////////////////////////////////////////////////
router.put(
  "/:id",
  [
    validarJWT,
    //    esAdminRole,
    //check('iddispositivo', 'El identificador es Obligatorio').not().isEmpty(),
    check("id").custom(existeAdminProyectoPorId),
    validarCampos,
  ],
  actualizaradminProyecto
);
//////////////////////////////////////////////////
//Borrar TMedidor solo Admin
router.delete(
  "/:id",
  [
    validarJWT,
    //    esAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    validarCampos,
  ],
  borrarAdminproyecto
);

module.exports = router;
