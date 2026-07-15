import { useEffect, useState } from 'react';
import { orderApi } from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await orderApi.get('/my');
        setOrders(data);
      } catch (err) {
        setError('Could not load orders. Is order-service running?');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <div className="error-banner">{error}</div>;
  if (orders.length === 0) return <div className="card"><h2>No orders yet</h2></div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div className="card order-card" key={order.id}>
          <div className="cart-row" style={{ borderBottom: 'none' }}>
            <strong>Order #{order.id}</strong>
            <span className="status-pill">{order.status}</span>
          </div>
          {order.items?.map((item) => (
            <div className="cart-row" key={item.id}>
              <span>
                {item.productName} x {item.quantity}
              </span>
              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="cart-row">
            <strong>Total</strong>
            <strong className="price">${Number(order.totalAmount).toFixed(2)}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
