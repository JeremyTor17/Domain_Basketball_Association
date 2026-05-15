# Domain Basketball Association API

Este proyecto es una API REST desarrollada con Node.js y Express para la gestión de una liga de baloncesto. Permite administrar equipos, jugadores, partidos, usuarios y estadísticas, conectándose a una base de datos MySQL.

**Tecnologías utilizadas**
*Node.js*
*Express*
*MySQL*
*JWT (autenticación)*
*CORS*
*dotenv*
*Descripción del proyecto*

***La API permite:***

*Gestionar equipos de baloncesto*
*Registrar jugadores*
*Consultar partidos*
*Ver estadísticas de jugadores*
*Autenticación de usuarios mediante login*
*Conexión con base de datos MySQL*
*URL del proyecto en producción*

https://domain-basketball-association-4.onrender.com

**Clonar el repositorio**

**Para descargar el proyecto, ejecuta:**

git clone https://github.com/TU-USUARIO/NOMBRE-REPO.git

**Luego entra a la carpeta:**

*cd NOMBRE-REPO*
*Instalación del proyecto*

**Instala las dependencias:**

*npm install*
*Configuración del entorno*

**Crea un archivo .env en la raíz del proyecto con las siguientes variables:**

PORT=5000
JWT_SECRET=tu_secreto
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tu_base_de_datos
Base de datos

Asegúrate de tener MySQL instalado y crear la base de datos antes de ejecutar el proyecto.

Las tablas se crean automáticamente al iniciar el servidor.

Ejecutar el proyecto

**Modo desarrollo:**

*npm run dev*

**Modo producción:
**
npm start
Endpoints principales
Equipos
GET /teams
POST /teams
PUT /teams/:id
DELETE /teams/:id
Jugadores
GET /players
Partidos
GET /games
Estadísticas
GET /stats
Usuarios
POST /login
Autenticación

El login devuelve un token JWT que debe usarse para rutas protegidas.

Autor

Proyecto desarrollado como sistema de gestión de liga de baloncesto.
