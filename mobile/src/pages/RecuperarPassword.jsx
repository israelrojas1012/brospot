import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function RecuperarPassword() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [token, setToken] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [toast, setToast] = useState(null);
  const [cargando, setCargando] = useState(false);
  const { tema, cambiarTema } = useTheme();

  const mostrarToast = (msg, tipo = 'exito') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  const solicitarCodigo = async () => {
    if (!correo) return mostrarToast('Ingresa tu correo', 'error');
    setCargando(true);
    try {
      await API.post('/recuperar/solicitar', { correo });
      mostrarToast('Código enviado a tu correo');
      setPaso(2);
    } catch (err) {
      mostrarToast(err.response?.data?.error || 'Error al enviar código', 'error');
    }
    setCargando(false);
  };

  const cambiarPassword = async () => {
    if (!token) return mostrarToast('Ingresa el código', 'error');
    if (nueva !== confirmar) return mostrarToast('Las contraseñas no coinciden', 'error');
    if (nueva.length < 6) return mostrarToast('Mínimo 6 caracteres', 'error');
    setCargando(true);
    try {
      await API.post('/recuperar/cambiar', { correo, token, nueva });
      mostrarToast('Contraseña actualizada correctamente');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      mostrarToast(err.response?.data?.error || 'Error al cambiar contraseña', 'error');
    }
    setCargando(false);
  };

  return (
    <div style={styles.container}>
      {/* Toggle de tema */}
      <button
        onClick={cambiarTema}
        style={styles.toggleTema}
        aria-label="Cambiar tema"
      >
        {tema === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Toast */}
      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.tipo === 'error' ? 'var(--color-error)' : 'var(--color-exito)'
        }}>
          <span style={styles.toastIcon}>
            {toast.tipo === 'error' ? '⚠' : '✓'}
          </span>
          {toast.msg}
        </div>
      )}

      <div style={styles.card}>
        {/* Logo y bienvenida */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>🔐</div>
          <h1 style={styles.titulo}>Recuperar contraseña</h1>
          <p style={styles.subtitulo}>
            {paso === 1
              ? 'Te ayudaremos a recuperar el acceso a tu cuenta'
              : 'Casi listo, solo falta un paso más'}
          </p>
        </div>

        {/* Indicador de pasos */}
        <div style={styles.steps}>
          <div style={{ ...styles.step, ...(paso >= 1 ? styles.stepActivo : {}) }}>
            <div style={{ ...styles.stepCirculo, ...(paso >= 1 ? styles.stepCirculoActivo : {}) }}>1</div>
            <span style={styles.stepLabel}>Correo</span>
          </div>
          <div style={{ ...styles.stepLinea, ...(paso >= 2 ? styles.stepLineaActiva : {}) }}></div>
          <div style={{ ...styles.step, ...(paso >= 2 ? styles.stepActivo : {}) }}>
            <div style={{ ...styles.stepCirculo, ...(paso >= 2 ? styles.stepCirculoActivo : {}) }}>2</div>
            <span style={styles.stepLabel}>Nueva clave</span>
          </div>
        </div>

        {paso === 1 ? (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                style={styles.input}
                placeholder="tu@correo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                type="email"
                autoFocus
              />
              <p style={styles.hint}>Te enviaremos un código de 6 caracteres a este correo</p>
            </div>

            <button
              style={{
                ...styles.btn,
                opacity: cargando ? 0.7 : 1,
                cursor: cargando ? 'wait' : 'pointer'
              }}
              onClick={solicitarCodigo}
              disabled={cargando}
            >
              {cargando ? 'Enviando...' : 'Enviar código'}
            </button>
          </>
        ) : (
          <>
            <div style={styles.codigoInfo}>
              <p style={styles.codigoTexto}>Enviamos el código a</p>
              <p style={styles.codigoCorreo}>{correo}</p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Código de verificación</label>
              <input
                style={styles.inputCodigo}
                placeholder="XXXXXX"
                value={token}
                onChange={e => setToken(e.target.value.toUpperCase())}
                maxLength={6}
                autoFocus
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Nueva contraseña</label>
              <input
                style={styles.input}
                placeholder="••••••••"
                type="password"
                value={nueva}
                onChange={e => setNueva(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirmar contraseña</label>
              <input
                style={styles.input}
                placeholder="••••••••"
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
              />
              <p style={styles.hint}>Mínimo 6 caracteres, combinando letras y números</p>
            </div>

            <button
              style={{
                ...styles.btn,
                opacity: cargando ? 0.7 : 1,
                cursor: cargando ? 'wait' : 'pointer'
              }}
              onClick={cambiarPassword}
              disabled={cargando}
            >
              {cargando ? 'Cambiando...' : 'Cambiar contraseña'}
            </button>

            <button
              style={styles.btnSecundario}
              onClick={() => setPaso(1)}
            >
              ← Volver atrás
            </button>
          </>
        )}

        {/* Separador */}
        <div style={styles.separador}>
          <div style={styles.linea}></div>
          <span style={styles.separadorTexto}>o</span>
          <div style={styles.linea}></div>
        </div>

        <p style={styles.linkFooter}>
          <Link to="/" style={styles.linkBold}>
            ← Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-app)',
    padding: '20px',
    position: 'relative',
    transition: 'background-color 0.3s ease',
  },
  toggleTema: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-full)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-suave)',
    fontSize: 20,
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 999,
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '90%',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  toastIcon: {
    fontSize: 16,
  },
  card: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    padding: '40px 32px',
    width: '100%',
    maxWidth: 440,
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-suave)',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  logoWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, var(--color-primario) 0%, var(--color-primario-hover) 100%)',
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-principal)',
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: 'var(--text-secundario)',
    textAlign: 'center',
    lineHeight: 1.5,
    maxWidth: 320,
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    opacity: 0.5,
    transition: 'opacity 0.3s ease',
  },
  stepActivo: {
    opacity: 1,
  },
  stepCirculo: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-full)',
    background: 'var(--bg-hover)',
    color: 'var(--text-suave)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    transition: 'all 0.3s ease',
  },
  stepCirculoActivo: {
    background: 'var(--color-primario)',
    color: '#fff',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-secundario)',
  },
  stepLinea: {
    width: 60,
    height: 2,
    background: 'var(--border-suave)',
    marginBottom: 16,
    transition: 'background 0.3s ease',
  },
  stepLineaActiva: {
    background: 'var(--color-primario)',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-secundario)',
  },
  input: {
    padding: '13px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border-suave)',
    background: 'var(--bg-input)',
    color: 'var(--text-principal)',
    fontSize: 15,
    width: '100%',
  },
  inputCodigo: {
    padding: '20px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border-suave)',
    background: 'var(--bg-input)',
    color: 'var(--text-principal)',
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: '10px',
    width: '100%',
    fontFamily: 'monospace',
  },
  codigoInfo: {
    textAlign: 'center',
    padding: '14px',
    background: 'var(--color-primario-suave)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-primario-borde)',
  },
  codigoTexto: {
    fontSize: 13,
    color: 'var(--text-secundario)',
    marginBottom: 4,
  },
  codigoCorreo: {
    fontSize: 14,
    color: 'var(--color-primario)',
    fontWeight: 700,
  },
  hint: {
    fontSize: 11,
    color: 'var(--text-suave)',
    marginTop: 2,
  },
  btn: {
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--color-primario)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    marginTop: 4,
    transition: 'all 0.2s ease',
  },
  btnSecundario: {
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border-suave)',
    background: 'transparent',
    color: 'var(--text-secundario)',
    fontSize: 13,
    fontWeight: 600,
  },
  separador: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '4px 0',
  },
  linea: {
    flex: 1,
    height: 1,
    background: 'var(--border-suave)',
  },
  separadorTexto: {
    fontSize: 12,
    color: 'var(--text-suave)',
    fontWeight: 500,
  },
  linkFooter: {
    textAlign: 'center',
    fontSize: 14,
    color: 'var(--text-secundario)',
  },
  linkBold: {
    color: 'var(--color-primario)',
    textDecoration: 'none',
    fontWeight: 700,
  },
};