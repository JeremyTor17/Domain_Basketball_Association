const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   CREATE TABLES (INIT)
========================= */

db.query(`
CREATE TABLE IF NOT EXISTS equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  ciudad VARCHAR(100)
)
`);

db.query(`
CREATE TABLE IF NOT EXISTS jugadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  posicion VARCHAR(50),
  equipo_id INT,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id)
)
`);

db.query(`
CREATE TABLE IF NOT EXISTS partidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipo_local INT,
  equipo_visitante INT,
  fecha DATETIME,
  puntos_local INT,
  puntos_visitante INT
)
`);

db.query(`
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  password VARCHAR(255),
  rol VARCHAR(20)
)
`);

db.query(`
CREATE TABLE IF NOT EXISTS estadisticas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jugador_id INT,
  puntos INT,
  rebotes INT,
  asistencias INT
)
`);

/* =========================
   INSERTS (CUIDADO: DUPLICA)
========================= */

db.query(`
INSERT INTO equipos (nombre, ciudad)
VALUES
('Strongest Hoops', 'N.A'),
('Superballers', 'N.A'),
('Dominican Hoopers', 'N.A'),
('Dominican Jazz', 'N.A'),
('Dominican Power', 'N.A')
`);

db.query(`
INSERT INTO jugadores (nombre, posicion, equipo_id)
VALUES
('Jeremy Ball', 'G', 1),
('Dunkkan Duncan', 'PG', 2),
('Sooper Flash', 'G', 3)
`);

db.query(`
INSERT INTO partidos (
  equipo_local,
  equipo_visitante,
  fecha,
  puntos_local,
  puntos_visitante
)
VALUES
(1, 2, NOW(), 102, 98),
(3, 4, NOW(), 87, 91),
(5, 1, NOW(), 110, 105)
`);

db.query(`
INSERT INTO users (email, password, rol)
VALUES
('admin@gmail.com', '123456', 'admin')
`);

db.query(`
INSERT INTO estadisticas (
  jugador_id,
  puntos,
  rebotes,
  asistencias
)
VALUES
(1, 28, 8, 7),
(2, 34, 5, 11),
(3, 30, 9, 4)
`);

/* =========================
   ROUTES
========================= */

// HOME
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// TEAMS
app.get('/teams', (req, res) => {
  db.query('SELECT * FROM equipos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/teams', (req, res) => {
  const { nombre, ciudad } = req.body;

  const query = "INSERT INTO equipos (nombre, ciudad) VALUES (?, ?)";

  db.query(query, [nombre, ciudad], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Equipo creado" });
  });
});

app.put('/teams/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, ciudad } = req.body;

  const query = `
    UPDATE equipos 
    SET nombre = ?, ciudad = ?
    WHERE id = ?
  `;

  db.query(query, [nombre, ciudad, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Equipo actualizado" });
  });
});

app.delete('/teams/:id', (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM equipos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Equipo eliminado" });
  });
});

// PLAYERS
app.get('/players', (req, res) => {
  db.query('SELECT * FROM jugadores', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GAMES
app.get('/games', (req, res) => {
  const query = `
    SELECT
      p.id,
      e1.nombre AS local_team,
      e2.nombre AS away_team,
      p.fecha,
      p.puntos_local,
      p.puntos_visitante
    FROM partidos p
    LEFT JOIN equipos e1 ON p.equipo_local = e1.id
    LEFT JOIN equipos e2 ON p.equipo_visitante = e2.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// LOGIN
app.post('/login', (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  const query = `
    SELECT * FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = results[0];

    const token = jwt.sign(
      {
        id: user.id,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user
    });
  });
});

// STATS
app.get('/stats', (req, res) => {
  const query = `
    SELECT
      e.id,
      j.nombre AS jugador,
      e.puntos,
      e.rebotes,
      e.asistencias
    FROM estadisticas e
    LEFT JOIN jugadores j ON e.jugador_id = j.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});