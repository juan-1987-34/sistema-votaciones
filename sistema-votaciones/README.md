# Sistema de Votaciones API

Proyecto backend hecho con Node.js, Express, PostgreSQL y Postman.
Incluye autenticación JWT, paginación, validaciones y estadísticas.

---

## Cómo ejecutar el proyecto

### 1. Instalar dependencias
npm install
npm install express
npm install pg
npm install jsonwebtoken
npm install dotenv

### 2. Crear archivo .env
PORT=3000  
ADMIN_USER=admin  
ADMIN_PASSWORD=123456  
JWT_SECRET=clavesecreta2026  

### 3. Ejecutar servidor
node src/servidor.js

Servidor en:
http://localhost:3000

---

## Login (JWT)

POST:
http://localhost:3000/auth/login

Body:
{
  "user": "admin",
  "password": "123456"
}

---

##  Usar token

En Postman:

Authorization -> Bearer Token  
Pegar el token del login

---

## ENDPOINTS

En postman empieza la Url luego el resto
POST:
http://localhost:3000

### VOTANTES

POST /voters  
GET /voters?page=1&limit=5  
GET /voters/:id  
DELETE /voters/:id  ## ejemplo para eliminar http://localhost:3000/voters/2

---

### CANDIDATOS

POST /candidates  
GET /candidates?page=1&limit=5  
GET /candidates/:id  
DELETE /candidates/:id  

---

### VOTOS

POST /votes  
GET /votes  
GET /votes/statistics  

---

## Estadísticas

GET /votes/statistics

Muestra:
- Total de votos por candidato
- Porcentaje de votos
- Total de votantes

---

## Reglas del sistema

- Un votante solo vota una vez
- Un candidato no puede ser votante
- Todos los POST están protegidos con JWT

---
###### Agregue  email a la tabla candidate para hacer el filtro 

¿Por qué?

Porque el enunciado dice:

"Un votante no puede ser registrado como candidato y viceversa."
Pero no dice cómo identificar que son la misma persona.

Si solo comparába el nombre, podríamos bloquear a dos personas distintas que se llamen igual.

Por eso puse el email, que es un identificador único. Me parece una decisión técnica razonable para
hacer ese filtro 

#### JWT

implementé JWT con credenciales configuradas mediante variables de entorno para proteger los endpoints administrativos sin modificar el modelo de datos."



## Echo por 
-Juan Pablo Quintero Amaya 