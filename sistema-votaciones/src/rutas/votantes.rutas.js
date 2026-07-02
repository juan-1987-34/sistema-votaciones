const verificarToken = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

const controlador = require("../controladores/votantes.controlador");

router.post("/", verificarToken, controlador.crearVotante);
router.get("/", controlador.obtenerVotantes);
router.get("/:id", controlador.obtenerVotantePorId);
router.delete("/:id", verificarToken, controlador.eliminarVotante);


module.exports = router;