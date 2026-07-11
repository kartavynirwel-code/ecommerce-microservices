import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(product);
  };

  return (
    <div className="product-card">
      <img
        src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
        alt={product.name}
      />
      <div className="product-card-body">
        {product.category && <span className="category-pill">{product.category}</span>}
        <h3>{product.name}</h3>
        <span className="price">${Number(product.price).toFixed(2)}</span>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
