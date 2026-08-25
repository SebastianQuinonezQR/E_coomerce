import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/products');
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2.5rem', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: 360 }}>
        <h2 style={{ margin: '0 0 1.5rem', textAlign: 'center' }}>Iniciar Sesión</h2>
        {error && <p style={{ color: '#e94560', textAlign: 'center', marginBottom: 12 }}>{error}</p>}
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Email</label>
        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ddd', marginBottom: 16, boxSizing: 'border-box' }} />
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Contraseña</label>
        <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ddd', marginBottom: 24, boxSizing: 'border-box' }} />
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: '#e94560' }}>Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
