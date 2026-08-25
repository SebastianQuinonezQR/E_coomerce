import { useEffect, useState } from 'react';
import { productApi } from '../api/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productApi.getAll({ search: search || undefined, page });
      setProducts(data.products);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Productos</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          Buscar
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Cargando...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>No se encontraron productos</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #ddd', background: page === i + 1 ? '#1a1a2e' : '#fff', color: page === i + 1 ? '#fff' : '#333', cursor: 'pointer' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
