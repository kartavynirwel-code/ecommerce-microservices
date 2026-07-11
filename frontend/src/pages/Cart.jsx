import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/client';

export default function Cart() {
  const { cart, refreshCart, updateQuantity, removeItem, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async () => {
    setError('');
    if (!cart.items || cart.items.length === 0) return;
    setPlacing(true);
    try {
      await orderApi.post('/api/orders', {
        items: cart.items.map((i) => ({
          productId: i.product_id,
          productName: i.product_name,
          quantity: i.quantity,
          unitPrice: i.unit_price,
        })),
        shippingAddress: address,
      });
      await clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed.');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="card">
        <h2>Your cart is empty</h2>
        <p>Browse the shop and add something warm to your cart.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <div className="card">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-row">
            <div>
              <strong>{item.product_name}</strong>
              <div>${Number(item.unit_price).toFixed(2)} each</div>
            </div>
            <div className="qty-control">
              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className="btn btn-danger" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="cart-row">
          <strong>Total</strong>
          <strong className="price">${Number(cart.total).toFixed(2)}</strong>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>Shipping Address</h3>
        {error && <div className="error-banner">{error}</div>}
        <div className="form-group">
          <input
            placeholder="123 Main St, City, Country"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleCheckout} disabled={placing}>
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
