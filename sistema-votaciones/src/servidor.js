
require("dotenv").config();
const express = require("express");
const app = express();

//middleware(para leer JSON)
app.use(express.json());


// importar rutas
const votantesRutas = require("./rutas/votantes.rutas");
const candidatosRutas = require("./rutas/candidatos.rutas");
const votosRutas = require("./rutas/votos.rutas");
const authRutas = require("./rutas/auth.rutas");


// usar rutas
app.use("/voters", votantesRutas);
app.use("/candidates", candidatosRutas);
app.use("/votes", votosRutas);
app.use("/auth", authRutas);

// prueba base
app.get("/", (req, res) => {
    res.json({ message: "API funcionando correctamente" });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});