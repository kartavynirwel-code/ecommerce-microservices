import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <header className="navbar">
      <Link to="/" className="brand">Terra &amp; Oak</Link>
      <nav>
        <Link to="/">Shop</Link>
        {user && <Link to="/orders">My Orders</Link>}
        {user && (
          <Link to="/cart">
            Cart{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        )}
        {user ? (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout ({user.username})
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">
              <span className="btn btn-primary">Sign Up</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
