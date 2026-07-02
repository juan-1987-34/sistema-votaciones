const pool = require("../configuracion/baseDatos");

// EMITIR VOTO
const crearVoto = async (req, res) => {
    try {

        const { voter_id, candidate_id } = req.body;

        //  Validar datos
        if (!voter_id || !candidate_id) {
            return res.status(400).json({
                message: "voter_id y candidate_id son obligatorios"
            });
        }

        //  Verificar votante
        const votante = await pool.query(
            "SELECT * FROM voters WHERE id = $1",
            [voter_id]
        );

        if (votante.rows.length === 0) {
            return res.status(404).json({
                message: "Votante no existe"
            });
        }

        // Verificar candidato
        const candidato = await pool.query(
            "SELECT * FROM candidates WHERE id = $1",
            [candidate_id]
        );

        if (candidato.rows.length === 0) {
            return res.status(404).json({
                message: "Candidato no existe"
            });
        }

        // Verificar si ya votó
        if (votante.rows[0].has_voted) {
            return res.status(400).json({
                message: "Este votante ya emitió su voto"
            });
        }

        //  Insertar voto
        await pool.query(
            "INSERT INTO votes (voter_id, candidate_id) VALUES ($1, $2)",
            [voter_id, candidate_id]
        );

        //  Marcar votante como votado
        await pool.query(
            "UPDATE voters SET has_voted = true WHERE id = $1",
            [voter_id]
        );

        //  Sumar voto al candidato
        await pool.query(
            "UPDATE candidates SET votes = votes + 1 WHERE id = $1",
            [candidate_id]
        );

        res.status(201).json({
            message: "Voto registrado correctamente"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });

    }
};

// OBTENER TODOS LOS VOTOS
const obtenerVotos = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                votes.id,
                voters.name AS votante,
                candidates.name AS candidato
            FROM votes
            INNER JOIN voters
                ON votes.voter_id = voters.id
            INNER JOIN candidates
                ON votes.candidate_id = candidates.id
        `);

        res.json({
            message: "Lista de votos",
            data: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });

    }
};

// OBTENER ESTADÍSTICAS
const obtenerEstadisticas = async (req, res) => {
    try {

        // Total de votos emitidos
        const totalVotos = await pool.query(
            "SELECT COUNT(*) AS total FROM votes"
        );

        // Total de votantes que ya votaron
        const totalVotantes = await pool.query(
            "SELECT COUNT(*) AS total FROM voters WHERE has_voted = true"
        );

        // Votos por candidato
        const estadisticas = await pool.query(`
            SELECT
                candidates.name,
                candidates.votes
            FROM candidates
            ORDER BY candidates.votes DESC
        `);

        const total = Number(totalVotos.rows[0].total);

        const resultado = estadisticas.rows.map(candidato => {

            const porcentaje =
                total === 0
                    ? 0
                    : ((candidato.votes * 100) / total).toFixed(2);

            return {
                candidato: candidato.name,
                votos: candidato.votes,
                porcentaje: porcentaje + "%"
            };

        });

        res.json({
            total_votos: total,
            total_votantes_que_han_votado: Number(totalVotantes.rows[0].total),
            resultados: resultado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });

    }
};

module.exports = {
    crearVoto,
     obtenerVotos,
     obtenerEstadisticas
};