import { useEffect } from 'react';
import { useCartStore } from '../store/cart.store';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orders';

export default function CartPage() {
  const { cart, fetchCart, updateItem, removeItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const total = cart?.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) ?? 0;

  const handleCheckout = async () => {
    await orderApi.create();
    await fetchCart();
    navigate('/orders');
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/products')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 16 }}>
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mi Carrito</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cart.items.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '2rem' }}>📦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.product.name}</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>${item.product.price.toFixed(2)} c/u</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => updateItem(item.id, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer', background: '#f5f5f5', fontWeight: 700 }}>-</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
              <button onClick={() => updateItem(item.id, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer', background: '#f5f5f5', fontWeight: 700 }}>+</button>
            </div>
            <span style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 10, marginTop: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total: <strong style={{ color: '#e94560' }}>${total.toFixed(2)}</strong></span>
        <button onClick={handleCheckout} style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}
