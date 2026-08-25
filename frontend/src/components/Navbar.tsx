import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: '#1a1a2e', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 700 }}>
        🛒 E-Commerce
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/products" style={{ color: '#ccc', textDecoration: 'none' }}>Productos</Link>
        {user ? (
          <>
            <Link to="/cart" style={{ color: '#ccc', textDecoration: 'none' }}>
              Carrito {itemCount > 0 && <span style={{ background: '#e94560', borderRadius: '50%', padding: '0 6px', marginLeft: 4, fontSize: '0.8rem' }}>{itemCount}</span>}
            </Link>
            <Link to="/orders" style={{ color: '#ccc', textDecoration: 'none' }}>Pedidos</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" style={{ color: '#f0a500', textDecoration: 'none' }}>Admin</Link>
            )}
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Hola, {user.name}</span>
            <button onClick={handleLogout} style={{ background: '#e94560', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>Iniciar sesión</Link>
            <Link to="/register" style={{ color: '#e94560', textDecoration: 'none', fontWeight: 600 }}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
