import { useEffect, useState } from 'react';
import { productApi } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts(params = {}) {
    setLoading(true);
    setError('');
    try {
      const { data } = await productApi.get('/api/products', { params });
      setProducts(data);
    } catch (err) {
      setError('Could not load products. Is product-service running?');
    } finally {
      setLoading(false);
    }
  }

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProducts({ search: search || undefined, category: category || undefined });
  };

  return (
    <div>
      <section className="hero">
        <h1>Warm essentials. Honest craft.</h1>
        <p>
          Discover leather goods, home essentials, and everyday tech curated
          for a warmer, more grounded lifestyle.
        </p>
      </section>

      <form className="filters" onSubmit={handleFilter}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Category (e.g. Electronics)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="btn btn-outline" type="submit">Filter</button>
      </form>

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
