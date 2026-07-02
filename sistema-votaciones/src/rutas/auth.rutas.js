const express = require("express");
const router = express.Router();

const controlador = require("../controladores/auth.controlador");

router.post("/login", controlador.login);

module.exports = router;