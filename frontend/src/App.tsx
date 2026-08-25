import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import { useAuthStore } from './store/auth.store';
import { useCartStore } from './store/cart.store';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { loadUser, user } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
