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

// OBTENER EXCEPCIONES DE UN LUGAR
router.get('/lugar/:lugar_id', async (req, res) => {
  try {
    const { lugar_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM horarios_excepciones WHERE lugar_id = $1 AND fecha >= CURRENT_DATE ORDER BY fecha ASC',
      [lugar_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener excepciones' });
  }
});

module.exports = router;
