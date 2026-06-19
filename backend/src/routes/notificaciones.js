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

// OBTENER NOTIFICACIONES DE UN USUARIO
router.get('/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY creado_en DESC',
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// MARCAR COMO LEIDA
router.put('/:id/leer', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE notificaciones SET leida = true WHERE id = $1', [id]);
    res.json({ mensaje: 'Notificación leída' });
  } catch (err) {
    res.status(500).json({ error: 'Error al marcar notificación' });
  }
});

// MARCAR TODAS COMO LEIDAS
router.put('/leer/todas/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    await pool.query('UPDATE notificaciones SET leida = true WHERE usuario_id = $1', [usuario_id]);
    res.json({ mensaje: 'Todas leídas' });
  } catch (err) {
    res.status(500).json({ error: 'Error al marcar notificaciones' });
  }
});

module.exports = router;
