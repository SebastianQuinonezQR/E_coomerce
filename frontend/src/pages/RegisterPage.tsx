import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      navigate('/products');
    } catch {
      setError('Error al registrar. Intenta con otro email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2.5rem', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: 360 }}>
        <h2 style={{ margin: '0 0 1.5rem', textAlign: 'center' }}>Crear Cuenta</h2>
        {error && <p style={{ color: '#e94560', textAlign: 'center', marginBottom: 12 }}>{error}</p>}
        {(['name', 'email', 'password'] as const).map(field => (
          <div key={field}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
              {field === 'name' ? 'Nombre' : field === 'email' ? 'Email' : 'Contraseña'}
            </label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              required
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ddd', marginBottom: 16, boxSizing: 'border-box' }}
            />
          </div>
        ))}
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#e94560' }}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
