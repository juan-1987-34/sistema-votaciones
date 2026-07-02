const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "sistema_votaciones",
    password: "Juanpablo12345*", // contraseña de PostgreSQL
    port: 5432,
});

module.exports = pool;