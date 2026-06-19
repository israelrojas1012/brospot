const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión:', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const excepcionesRoutes = require('./routes/excepciones');
app.use('/api/lugares/excepciones', excepcionesRoutes);

const lugaresRoutes = require('./routes/lugares');
app.use('/api/lugares', lugaresRoutes);

const inscripcionesRoutes = require('./routes/inscripciones');
app.use('/api/inscripciones', inscripcionesRoutes);

const reservasRoutes = require('./routes/reservas');
app.use('/api/reservas', reservasRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const notificacionesRoutes = require('./routes/notificaciones');
app.use('/api/notificaciones', notificacionesRoutes);

const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

const recuperarRoutes = require('./routes/recuperar');
app.use('/api/recuperar', recuperarRoutes);

const asistenciaRoutes = require('./routes/asistencia');
app.use('/api/asistencia', asistenciaRoutes);

const fotosRoutes = require('./routes/fotos');
app.use('/api/fotos', fotosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '🟢 Brospot API funcionando' });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT}`);
});