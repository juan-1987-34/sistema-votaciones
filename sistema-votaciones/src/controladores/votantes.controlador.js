const pool = require("../configuracion/baseDatos");

// CREAR VOTANTE
const crearVotante = async (req, res) => {
    try {

        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Nombre y email son obligatorios"
            });
        }

        // Verificar si ya existe como votante
        const existeVotante = await pool.query(
            "SELECT * FROM voters WHERE email = $1",
            [email]
        );

        if (existeVotante.rows.length > 0) {
            return res.status(400).json({
                message: "Este votante ya existe"
            });
        }

        // Verificar si ya existe como candidato
        const existeCandidato = await pool.query(
            "SELECT * FROM candidates WHERE email = $1",
            [email]
        );

        if (existeCandidato.rows.length > 0) {
            return res.status(400).json({
                message: "Un candidato no puede registrarse como votante"
            });
        }

        const result = await pool.query(
            "INSERT INTO voters (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );

        res.status(201).json({
            message: "Votante creado correctamente",
            data: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error en el servidor"
        });

    }
};

// LISTAR VOTANTES
const obtenerVotantes = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const total = await pool.query(
            "SELECT COUNT(*) FROM voters"
        );

        const result = await pool.query(
            "SELECT * FROM voters ORDER BY id LIMIT $1 OFFSET $2",
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
            message: "Error al obtener votantes"
        });

    }
};

// OBTENER VOTANTE POR ID
const obtenerVotantePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM voters WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Votante no encontrado"
            });
        }

        res.json({
            message: "Votante encontrado",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });
    }
};


// ELIMINAR VOTANTE
const eliminarVotante = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el votante existe
        const existe = await pool.query(
            "SELECT * FROM voters WHERE id = $1",
            [id]
        );

        if (existe.rows.length === 0) {
            return res.status(404).json({
                message: "Votante no encontrado"
            });
        }

        // Eliminar el votante
        await pool.query(
            "DELETE FROM voters WHERE id = $1",
            [id]
        );

        res.json({
            message: "Votante eliminado correctamente"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });
    }
};

module.exports = {
    crearVotante,
    obtenerVotantes,
    obtenerVotantePorId,
     eliminarVotante
};