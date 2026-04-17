
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './Components/Layout';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Profile from './Pages/Profile';
import OrderHistory from './Pages/OrderHistory';
import OrderDetails from './Pages/OrderDetails';
import Home from './Pages/Home';

import { CartProvider } from "./CartContext";

const NotFound = () => <div className="p-10">404 - Page Not Found</div>;

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  // If no token, redirect to login
  // return token ? children : <Navigate to="/login" replace />;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Grouped Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/OrderHistory" element={<OrderHistory />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />
            </Route>
          </Route>

          {/* Other Public Routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
