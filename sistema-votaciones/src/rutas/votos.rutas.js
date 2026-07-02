const verificarToken = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

const controlador = require("../controladores/votos.controlador");

// POST /votes
router.post("/", verificarToken, controlador.crearVoto);
router.get("/", controlador.obtenerVotos);
router.get("/statistics", controlador.obtenerEstadisticas);

module.exports = router;