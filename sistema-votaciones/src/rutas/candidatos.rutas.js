const verificarToken = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

const controlador = require("../controladores/candidatos.controlador");

router.post("/", verificarToken, controlador.crearCandidato);
router.get("/", controlador.obtenerCandidatos);
router.get("/:id", controlador.obtenerCandidatoPorId);
router.delete("/:id", verificarToken, controlador.eliminarCandidato);

module.exports = router;