import { useEffect, useState } from 'react';
import { orderApi } from '../api/orders';
import { Order } from '../types';

const statusColors: Record<string, string> = {
  PENDING: '#f0a500',
  PROCESSING: '#2196f3',
  SHIPPED: '#9c27b0',
  DELIVERED: '#4caf50',
  CANCELLED: '#e94560',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    orderApi.getAll().then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Cargando...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mis Pedidos</h1>
      {orders.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>No tienes pedidos aún</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ background: '#f9f9f9', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: 700 }}>Pedido #{order.id}</span>
                <span style={{ background: statusColors[order.status], color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
                  {statusLabels[order.status]}
                </span>
                <span style={{ color: '#888', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString('es')}</span>
                <span style={{ fontWeight: 700, color: '#1a1a2e' }}>${order.total.toFixed(2)}</span>
              </div>
              <div style={{ padding: '1rem 1.5rem' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem' }}>
                    <span>{item.product.name} × {item.quantity}</span>
                    <span style={{ color: '#666' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
