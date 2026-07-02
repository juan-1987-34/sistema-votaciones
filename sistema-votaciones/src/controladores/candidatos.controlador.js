const pool = require("../configuracion/baseDatos");

// crear candidato
const crearCandidato = async (req, res) => {
    try {

        const { name, email, party } = req.body;

        // Validar que los datos obligatorios existan
        if (!name || !email) {
            return res.status(400).json({
                message: "Nombre y email son obligatorios"
            });
        }

        // Verificar que el email no exista como candidato
        const existeCandidato = await pool.query(
            "SELECT * FROM candidates WHERE email = $1",
            [email]
        );

        if (existeCandidato.rows.length > 0) {
            return res.status(400).json({
                message: "Este candidato ya existe"
            });
        }

        // Verificar que el email no pertenezca a un votante
        const existeVotante = await pool.query(
            "SELECT * FROM voters WHERE email = $1",
            [email]
        );

        if (existeVotante.rows.length > 0) {
            return res.status(400).json({
                message: "Un votante no puede registrarse como candidato"
            });
        }

        // Insertar candidato
        const result = await pool.query(
            `INSERT INTO candidates (name, email, party)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, email, party]
        );

        res.status(201).json({
            message: "Candidato creado correctamente",
            data: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });

    }
};
   // obteener candidatos
const obtenerCandidatos = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const total = await pool.query(
            "SELECT COUNT(*) FROM candidates"
        );

        const result = await pool.query(
            "SELECT * FROM candidates ORDER BY id LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        res.json({
            page,
            limit,
            total: Number(total.rows[0].count),
            data: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error al obtener candidatos"
        });

    }
};

const obtenerCandidatoPorId = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM candidates WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Candidato no encontrado"
            });
        }

        res.json({
            message: "Candidato encontrado",
            data: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });

    }
};
  // eliminar candidatos
const eliminarCandidato = async (req, res) => {
    try {

        const { id } = req.params;

        // Verificar si existe
        const existe = await pool.query(
            "SELECT * FROM candidates WHERE id = $1",
            [id]
        );

        if (existe.rows.length === 0) {
            return res.status(404).json({
                message: "Candidato no encontrado"
            });
        }

        // Eliminar
        await pool.query(
            "DELETE FROM candidates WHERE id = $1",
            [id]
        );

        res.json({
            message: "Candidato eliminado correctamente"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });

    }
};

module.exports = {
    crearCandidato,
    obtenerCandidatos,
    obtenerCandidatoPorId,
    eliminarCandidato
};