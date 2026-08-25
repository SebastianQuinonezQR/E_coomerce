import { Product } from '../types';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    await addItem(product.id);
  };

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
      ) : (
        <div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📦</div>
      )}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: '0.8rem', color: '#888', background: '#f0f0f0', borderRadius: 4, padding: '2px 8px', alignSelf: 'flex-start' }}>
          {product.category.name}
        </span>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{product.name}</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '0.85rem', flex: 1 }}>{product.description.slice(0, 80)}...</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e' }}>${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{ background: product.stock === 0 ? '#ccc' : '#e94560', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
