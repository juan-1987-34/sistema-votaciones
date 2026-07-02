const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {

        const { user, password } = req.body;

        // validar campos
        if (!user || !password) {
            return res.status(400).json({
                message: "Usuario y contraseña son obligatorios"
            });
        }

        // validar credenciales desde .env
        if (
            user !== process.env.ADMIN_USER ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            });
        }

        // generar token
        const token = jwt.sign(
            {
                user: user
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login exitoso",
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error del servidor"
        });

    }
};

module.exports = {
    login
};