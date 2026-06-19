 
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// OBTENER TODOS LOS LUGARES
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lugares ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener lugares' });
  }
});

// OBTENER UN LUGAR POR ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lugar = await pool.query('SELECT * FROM lugares WHERE id = $1', [id]);
    const horarios = await pool.query('SELECT * FROM horarios WHERE lugar_id = $1', [id]);
    res.json({ ...lugar.rows[0], horarios: horarios.rows });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el lugar' });
  }
});

module.exports = router;