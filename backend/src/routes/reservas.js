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

router.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.id, r.fecha, r.estado, r.horario_id,
             l.nombre as lugar_nombre,
             h.dia, h.hora_inicio, h.hora_fin
      FROM reservas r
      JOIN horarios_plantilla h ON r.horario_id = h.id
      JOIN lugares l ON h.lugar_id = l.id
      WHERE r.usuario_id = $1
      ORDER BY r.creado_en DESC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

router.post('/', async (req, res) => {
  const { usuario_id, horario_id, fecha } = req.body;
  try {
    const existe = await pool.query(
      'SELECT id FROM reservas WHERE usuario_id = $1 AND horario_id = $2 AND fecha = $3',
      [usuario_id, horario_id, fecha]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: '⚠️ Ya tienes una reserva para este horario' });
    }
    // Contar cuantos cupos restan
    const horario = await pool.query('SELECT cupos FROM horarios_plantilla WHERE id = $1', [horario_id]);
    const reservados = await pool.query(
      'SELECT COUNT(*) FROM reservas WHERE horario_id = $1 AND fecha = $2',
      [horario_id, fecha]
    );
    const cuposTotal = parseInt(horario.rows[0].cupos);
    const cuposReservados = parseInt(reservados.rows[0].count);
    if (cuposReservados >= cuposTotal) {
      return res.status(400).json({ error: '⚠️ No hay cupos disponibles' });
    }
    const result = await pool.query(
      'INSERT INTO reservas (usuario_id, horario_id, fecha) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, horario_id, fecha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await pool.query(`
      SELECT r.*, h.hora_inicio, h.dia
      FROM reservas r
      JOIN horarios_plantilla h ON r.horario_id = h.id
      WHERE r.id = $1
    `, [id]);

    if (reserva.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const r = reserva.rows[0];
    const ahora = new Date();
    const [h, m] = r.hora_inicio.split(':');
    const fechaReserva = new Date(r.fecha);
    fechaReserva.setHours(parseInt(h), parseInt(m), 0, 0);
    const diff = (fechaReserva - ahora) / (1000 * 60 * 60);

    if (diff < 2) {
      return res.status(400).json({ error: '⏰ No puedes cancelar con menos de 2 horas de anticipación' });
    }

    await pool.query('DELETE FROM reservas WHERE id = $1', [id]);
    res.json({ mensaje: 'Reserva cancelada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
});

module.exports = router;