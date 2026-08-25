import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#fff', textAlign: 'center', padding: '5rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem' }}>Tu tienda online 🛍️</h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa', margin: '0 0 2rem' }}>Encuentra los mejores productos al mejor precio</p>
        <Link to="/products" style={{ background: '#e94560', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: '1.1rem' }}>
          Ver Productos
        </Link>
      </div>
      <div style={{ maxWidth: 900, margin: '4rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
        {[
          { icon: '🚚', title: 'Envío Rápido', desc: 'Entrega en 24-48 horas' },
          { icon: '🔒', title: 'Pago Seguro', desc: 'Tus datos siempre protegidos' },
          { icon: '↩️', title: 'Devoluciones', desc: '30 días para devolver' },
        ].map(f => (
          <div key={f.title} style={{ padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
            <h3 style={{ margin: '0 0 0.5rem' }}>{f.title}</h3>
            <p style={{ color: '#888', margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
